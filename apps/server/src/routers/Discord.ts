import { Router } from "express";
import { encryptToken, decryptToken, generateRandomCode } from "../encryption/encryption";
import { DiscordUser } from "../Schemas/DiscordUser";

declare module "express-session" {
    interface SessionData {
        oauthState?: string;
        user?: {
            avatar?: string,
            username: string,
            id: string
        }
    }
}

export interface TokenReturnData {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

export interface TokenDataSelfIdentify {
    access_token: string;
    token_type: string;
}

const CALLBACK_DOMAIN = (process.env.DOMAIN || "http://localhost:3000") + "/auth/discord/callback";

const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10';

const router = Router();

async function exchangeCode(code: string) {
    const response = await fetch(DISCORD_API_ENDPOINT + "/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID!,
            client_secret: process.env.CLIENT_SECRET!,
            code,
            grant_type: 'authorization_code',
            redirect_uri: CALLBACK_DOMAIN,
            scope: 'identify',
        }).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (!response.ok) return undefined;

    return response.json() as Promise<TokenReturnData>;
}

export interface DiscordUserInfo {
    id: string,
    username: string,
    avatar?: string
}

async function getSelfInfo(tokens: TokenDataSelfIdentify) {
    const response = await fetch(DISCORD_API_ENDPOINT + "/users/@me", {
        headers: {
            "Authorization": `${tokens.token_type} ${tokens.access_token}`
        }
    })

    if (!response.ok) return undefined;

    let userData = await response.json() as DiscordUserInfo;

    return userData;
}

const handleFetchError = (e: unknown) => {
    console.log("Error while fetching");
    console.log(e);
    return undefined;
}

function generateOauthUrl(code: string) {
    return `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(CALLBACK_DOMAIN)}&scope=identify+email&state=${code}`;
}

router.get("/discord", (req, res) => {
    const code = generateRandomCode();
    const oauthUrl = generateOauthUrl(code);

    req.session.oauthState = code;

    req.session.save((e) => {
        if (e) {
            console.log(e);
            return;
        }

        res.redirect(oauthUrl);
    });
})

router.get('/discord/callback', async (req, res) => {
    const savedState = req.session.oauthState;
    const { code, state } = req.query;

    if (!state || state !== savedState) {
        res.status(403).json({
            message: "Your provided state does not match the saved state or it wasn't provided",
            status: 403
        })
        return;
    }

    delete req.session.oauthState;

    if (!code || typeof code !== "string") {
        res.status(422).json({
            status: 422,
            message: "No code provided from Discord"
        });
        return;
    }

    const tokenData = await exchangeCode(code).catch(handleFetchError);

    if (!tokenData) {
        res.status(500).json({
            message: "Internal server error",
            status: 500
        });
        return;
    }

    const userData = await getSelfInfo(tokenData).catch(handleFetchError);

    if (!userData) {
        res.status(500).json({
            message: "Internal server error",
            status: 500
        });
        return;
    }

    const saveObject = {
        userId: userData.id,
        access_token: encryptToken(tokenData.access_token),
        refresh_token: encryptToken(tokenData.refresh_token),
        expires_in: Math.floor(Date.now() / 1000) + tokenData.expires_in,
        token_type: tokenData.token_type
    }

    await DiscordUser.findOneAndUpdate(
        { userId: userData.id },
        saveObject,
        { upsert: true }
    );

    req.session.user = {
        avatar: userData.avatar,
        username: userData.username,
        id: userData.id
    }

    req.session.save((err) => {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect(process.env.ALLOW_ORIGIN || "http://localhost:5173/dashboard");
    });
})

router.get("/me", async (req, res) => {
    if (req.session.user) {
        const isRefetch = Boolean(req.query.refetch || false);
        const user = req.session.user;

        if(!isRefetch) return res.json(req.session.user);

        const userData = await DiscordUser.findOne({ userId: user.id });

        if (!userData) return res.status(404).json({
            message: "User was not found in the database"
        })

        const { access_token, refresh_token, expires_in, token_type } = userData;

        let accessToken = decryptToken(access_token);
        let tokenType = token_type;
        let refreshToken = decryptToken(refresh_token);

        if (Date.now() > expires_in) {
            const response = await fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    client_id: process.env.CLIENT_ID!,
                    client_secret: process.env.CLIENT_SECRET!,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            if (!response.ok) {
                res.status(500).json({
                    message: "Unable to refresh token"
                });
                return;
            }

            let tokenData = await response.json() as TokenReturnData;

            tokenData.expires_in = tokenData.expires_in + Math.floor(Date.now() / 1000);

            accessToken = structuredClone(tokenData.access_token);
            tokenType = tokenData.token_type;

            tokenData.access_token = encryptToken(tokenData.access_token);
            tokenData.refresh_token = encryptToken(tokenData.refresh_token);

            await DiscordUser.findOneAndUpdate(
                { userId: user.id },
                tokenData,
                { upsert: true }
            );
        }

        const ud = await getSelfInfo({
            access_token: accessToken,
            token_type: tokenType
        });

        if(ud) req.session.user = {
            id: ud.id,
            username: ud.username,
            avatar: ud.avatar
        }
        
        return res.json(req.session.user);
    };

    res.status(401).json({
        message: "Unauthorized"
    })
})

export default router;