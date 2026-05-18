const MASTER_KEY = "MASTER_KEY_ENC"

function makeLogMessage(msg: string) {
    return "[DISFLOW CRYPTO]: " + msg;
}

async function deriveKey(passcode: string, salt: Uint8Array<ArrayBuffer>) {
    const encoder = new TextEncoder();

    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(passcode),
        "PBKDF2",
        false,
        ['deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 10000,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )

    return key;
}

export const Crypto = {
    keyFromArrayBuffer(buffer: ArrayBuffer) {
        return crypto.subtle.importKey(
            "raw",
            buffer,
            "AES-GCM",
            false,
            ['encrypt', 'decrypt']
        )
    },

    async encryptData(data: string | Uint8Array<ArrayBuffer>, key: CryptoKey) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoder = new TextEncoder();

        return {
            enc: await crypto.subtle.encrypt(
                {
                    "name": "AES-GCM",
                    iv
                },
                key,
                data instanceof Uint8Array ? data : encoder.encode(data)
            ),
            iv
        }
    },

    async decryptData(data: ArrayBuffer, iv: Uint8Array<ArrayBuffer>, key: CryptoKey) {
        return crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv
            },
            key,
            data
        )
    },

    pack(enc: Uint8Array, salt: Uint8Array, iv: Uint8Array) {
        const combined = new Uint8Array(enc.length + salt.length + iv.length);

        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(enc, iv.length + salt.length);

        return btoa(String.fromCharCode(...combined));
    },

    unpack(str: string) {
        const rawString = atob(str);
        const combined = new Uint8Array(rawString.split("").map(v => v.charCodeAt(0)));

        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 16 + 12);
        const cipher = combined.slice(16 + 12);

        return {
            salt,
            iv,
            cipher: cipher
        }
    },

    async createMasterKey(passcode: string, override = false) {
        if (passcode.length > 6) throw new Error(makeLogMessage("Passcode must be a 6 digit code."));

        console.log(makeLogMessage("Recieved key creation request."));
        const master = localStorage.getItem(MASTER_KEY);

        if (master && !override) throw new Error(makeLogMessage("Master key already exists."))
        if (master && override) console.log(makeLogMessage("Master key override request recieved. Make sure you backed up all your data."))

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await deriveKey(passcode, salt);

        const masterKey = crypto.getRandomValues(new Uint8Array(32));

        const { enc, iv } = await this.encryptData(masterKey, key);

        const pack = this.pack(new Uint8Array(enc), salt, iv);

        localStorage.setItem(MASTER_KEY, pack);

        return enc;
    },

    async getMasterKey(pin: string) {
        const master = localStorage.getItem(MASTER_KEY);

        if (!master) throw new Error(makeLogMessage("Create a master key first."));

        const { salt, iv, cipher } = this.unpack(master);
        const key = await deriveKey(pin, salt);

        const masterDecrypted = await this.decryptData(cipher.buffer, iv, key);

        return masterDecrypted;
    }
} as const;

export type Crypto = (typeof Crypto)[keyof typeof Crypto];

export class SudoMode {
    public static masterKey: ArrayBuffer | undefined = undefined;

    public static async enterSudo(pin: string) {
        if (this.masterKey) throw new Error("Already in sudo mode.")
        try {
            const hasMasterKey = localStorage.getItem(MASTER_KEY);

            this.masterKey = hasMasterKey ? await Crypto.getMasterKey(pin) : await Crypto.createMasterKey(pin);
        } catch {
            return false; // password incorrect
        }
    }

    public static exitSudo() {
        if (this.masterKey) return this.masterKey = undefined;
        throw new Error("Not in sudo mode.")
    }

    public static isSudo(): this is { masterKey: ArrayBuffer } {
        return !!this.masterKey;
    }
}