import { json } from '@sveltejs/kit';

function verifyToken(token: string) {
    const parts = token.split(".");

    // a valid discord token contains 3 parts
    if (parts.length !== 3) return false;

    let id = undefined;
    try {
        id = atob(parts[0]);
    } catch {
        id = undefined;
    }

    if (!id) return false;

    // must be a Discord ID (Snowflake)
    if (!(/^[0-9]+$/i.test(id))) return false;

    return true;
}

export async function GET({ request }) {
    try {
        const token = request.headers.get("X-Discord-Token");

        if (!token) return json(
            {
                message: "Token not found in header"
            },
            {
                status: 400
            }
        )

        const isCorrectFormat = verifyToken(token);

        if (!isCorrectFormat) return json(
            {
                message: "Incorrect token format"
            },
            {
                status: 403
            }
        )

        const info = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                "Authorization": `Bot ${token}`
            }
        })

        if (!info.ok) return json(
            {
                message: "Fetching of Discord info failed"
            },
            {
                status: info.status
            }
        )

        const jsonInfo = await info.json();

        const returnData = {
            username: jsonInfo.username,
            id: jsonInfo.id,
            avatar: jsonInfo.avatar ? `https://cdn.discordapp.com/avatars/${jsonInfo.id}/${jsonInfo.avatar}.png` : undefined,
            bot: jsonInfo.bot
        }

        return json(returnData);
    } catch (e) {
        console.log(e);
        return json({
            message: "internal error",
        }, { status: 500 })
    }
}