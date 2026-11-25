const MASTER_KEY = "MASTER_KEY_ENC";

function makeLogMessage(msg: string) {
	return `[DISFLOW CRYPTO]: ${msg}`;
}

export type EncryptedData = {
	/**
	 * The encrypted buffer
	 */
	enc: ArrayBuffer;
	/**
	 * Random IV used in the encryption
	 */
	iv: Uint8Array<ArrayBuffer>;
};

async function deriveKey(passcode: string, salt: Uint8Array<ArrayBuffer>) {
	const encoder = new TextEncoder();

	const baseKey = await crypto.subtle.importKey(
		"raw",
		encoder.encode(passcode),
		"PBKDF2",
		false,
		["deriveKey"],
	);

	const key = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 10000,
			hash: "SHA-256",
		},
		baseKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"],
	);

	return key;
}

/**
 * Manage the cryptographic operations used in disflow
 */
export const Crypto = {
	/**
	 * Turn an valid ArrayBuffer into a suble crypto key
	 * @param buffer The buffer you want to turn into key
	 * @returns The crypto key
	 */
	keyFromArrayBuffer(buffer: ArrayBuffer): Promise<CryptoKey> {
		return crypto.subtle.importKey("raw", buffer, "AES-GCM", false, [
			"encrypt",
			"decrypt",
		]);
	},

	/**
	 * Encrypt plain data
	 * @param data The data you want to encrypt. If it is a string, it will get encoded into an Uint8Array<Buffer>
	 * @param key The key to encrypt the data in
	 * @returns The encrypted data along with the IV
	 */
	async encryptData(
		data: string | Uint8Array<ArrayBuffer>,
		key: CryptoKey,
	): Promise<EncryptedData> {
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encoder = new TextEncoder();

		return {
			enc: await crypto.subtle.encrypt(
				{
					name: "AES-GCM",
					iv,
				},
				key,
				data instanceof Uint8Array ? data : encoder.encode(data),
			),
			iv,
		};
	},

	/**
	 * Decrypte some previously encrypted data with the same key
	 * @param data The data you want to decrypt
	 * @param iv The IV of returned from the encrypt method
	 * @param key The key you encrypted the data with
	 * @returns Decrypted ArrayBuffer
	 *
	 * @example
	 * ```js
	 * const decrypted = await Crypto.decryptData(someData, someIv, someKey);
	 * // get the text back from the data
	 * const text = new TextDecoder().decode(decrypted)
	 * ```
	 */
	async decryptData(
		data: ArrayBuffer,
		iv: Uint8Array<ArrayBuffer>,
		key: CryptoKey,
	) {
		return crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv,
			},
			key,
			data,
		);
	},

	/**
	 * Pack the data into a string to store into IndexedDB or localStorage in a Base64 encoded format
	 * @param enc The encrypted content
	 * @param salt The salt (just a random one if it is not hashing)
	 * @param iv The IV of the encrypted content
	 * @returns Base64 encoded encrypted content
	 */
	pack(enc: Uint8Array, salt: Uint8Array, iv: Uint8Array) {
		const combined = new Uint8Array(enc.length + salt.length + iv.length);

		combined.set(salt, 0);
		combined.set(iv, salt.length);
		combined.set(enc, iv.length + salt.length);

		return btoa(String.fromCharCode(...combined));
	},

	/**
	 * Unpack the data that was packed. Maybe to unpack data from localStorage or IndexedDB
	 * @param str The data that was packed
	 * @returns Unpacked data
	 */
	unpack(str: string) {
		const rawString = atob(str);
		const combined = new Uint8Array(
			rawString.split("").map((v) => v.charCodeAt(0)),
		);

		const salt = combined.slice(0, 16);
		const iv = combined.slice(16, 16 + 12);
		const cipher = combined.slice(16 + 12);

		return {
			salt,
			iv,
			cipher,
		};
	},

	/**
	 * Creates a master key to be used in cryptographic operations
	 * @param passcode The 6 digit passcode that is used to derive the master key
	 * @param override Whether to override the existing master key. This will make all encrypted data un-decryptable
	 * @returns The master key
	 */
	async createMasterKey(passcode: string, override = false) {
		if (passcode.length > 6)
			throw new Error(makeLogMessage("Passcode must be a 6 digit code."));

		console.log(makeLogMessage("Recieved key creation request."));
		const master = localStorage.getItem(MASTER_KEY);

		if (master && !override)
			throw new Error(makeLogMessage("Master key already exists."));
		if (master && override)
			console.log(
				makeLogMessage(
					"Master key override request recieved. Make sure you backed up all your data.",
				),
			);

		const salt = crypto.getRandomValues(new Uint8Array(16));
		const key = await deriveKey(passcode, salt);

		const masterKey = crypto.getRandomValues(new Uint8Array(32));

		const { enc, iv } = await this.encryptData(masterKey, key);

		const pack = this.pack(new Uint8Array(enc), salt, iv);

		localStorage.setItem(MASTER_KEY, pack);

		return masterKey.buffer;
	},

	/**
	 * Grab the master key from localStorage
	 * @param pin The 6 digit PIN used to derive the master key
	 * @returns The master key if the pin is valid
	 */
	async getMasterKey(pin: string) {
		const master = localStorage.getItem(MASTER_KEY);

		if (!master) throw new Error(makeLogMessage("Create a master key first."));

		const { salt, iv, cipher } = this.unpack(master);
		const key = await deriveKey(pin, salt);

		const masterDecrypted = await this.decryptData(cipher.buffer, iv, key);

		return masterDecrypted;
	},
} as const;

export type Crypto = (typeof Crypto)[keyof typeof Crypto];

/**
 * Manage the SUDO mode. Enter SUDO to make sensitive operations
 */
export const SudoMode = {
	masterKey: undefined as ArrayBuffer | undefined,

	/**
	 * Enter SUDO mode
	 * @param pin The pin used to create the master key
	 * @returns 'true' if sudo is successfully entered, false otherwise
	 */
	async enterSudo(pin: string) {
		if (this.masterKey) throw new Error("Already in sudo mode.");
		try {
			const hasMasterKey = localStorage.getItem(MASTER_KEY);

			SudoMode.masterKey = hasMasterKey
				? await Crypto.getMasterKey(pin)
				: await Crypto.createMasterKey(pin);
			return true;
		} catch {
			return false; // password incorrect
		}
	},

	/**
	 * Leave SUDO mode
	 */
	exitSudo() {
		if (this.masterKey) {
			this.masterKey = undefined;
			return;
		}
		throw new Error("Not in sudo mode.");
	},

	/**
	 * Type guard. Ensures masterKey on `this` is defined.
	 * @returns Whether the application is in SUDO mode or not
	 */
	isSudo(): this is { masterKey: ArrayBuffer } {
		return !!this.masterKey;
	},
};

export type SudoMode = (typeof SudoMode)[keyof typeof SudoMode];
