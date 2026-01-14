import express from "express";
import Gun from "gun";
import cors from "cors";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import discordRouter, { type DiscordUserInfo } from "./routers/Discord";
import cryptoRouter from "./routers/Crypto";
import mongoose from "mongoose";

async function getBotInfo(botId: string) {
    const response = await fetch("https://discord.com/api/v10/users/" + botId, {
        headers: {
            "Authorization": `Bot ${process.env.BOT_TOKEN}`
        }
    })

    if (!response.ok) return undefined;

    let userData = await response.json() as DiscordUserInfo & {
        bot: boolean
    };

    return userData;
}

const app = express();

const redisClient = createClient({
    url: process.env.REDIS_URL!
});

const origin = process.env.NODE_ENV === "production" ? process.env.ALLOW_ORIGIN! : "http://localhost:5173";

console.log("ALLOWING ORIGIN " + origin)

app.use(cors({
    origin: origin, // default vite URL for development purposes
    credentials: true
}));
app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: process.env.SESSION_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // keep the user logged in for 7 days only
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
}));

app.use("/auth", discordRouter);
app.use("/crypto", cryptoRouter);

app.use((Gun as any).serve);

app.get("/applications/:id", async (req, res) => {
    const appId = req.params.id;
    const user = req.session.user;

    if (req.headers.origin === origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if(!user) return res.status(401).json({
        message: "Unauthenticated"
    })

    const botInfo = await getBotInfo(appId);

    if(!botInfo) return res.status(500).json({
        message: "Unable to fetch bot"
    })

    if(!botInfo.bot) return res.status(422).json({
        message: "The ID is not a bot"
    })

    return res.json({
        username: botInfo.username,
        avatar: botInfo.avatar,
        id: botInfo.id
    })
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on " + (process.env.PORT || 3000))
});

mongoose.connect(process.env.MONGO_URL!).then(() => console.log("Connected to MongoDB!"))
redisClient.connect().then(() => console.log("Connected to Redis!"));

// set up gun relay server
Gun({
    web: server
});
