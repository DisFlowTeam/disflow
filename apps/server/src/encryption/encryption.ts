import crypto from "node:crypto";

const MASTER_KEY = Buffer.from(process.env.MASTER_KEY!, "hex");

export function createSeed(discordId: string) {
    return crypto.createHmac("sha256", MASTER_KEY)
        .update(discordId)
        .digest()
        .toString("hex");
}

// For Discord's Oauth2
export function generateRandomCode() {
    return crypto.randomBytes(32).toString("hex");
}

export function encryptToken(token: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", MASTER_KEY, iv);

    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptToken(encryptedData: string) {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv("aes-256-gcm", MASTER_KEY, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}