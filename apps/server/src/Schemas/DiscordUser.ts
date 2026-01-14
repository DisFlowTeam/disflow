import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    access_token: {
        type: String,
        required: true
    },
    expires_in: {
        type: Number,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    token_type: {
        type: String,
        required: true
    }
})

export const DiscordUser = mongoose.model("user", userSchema)