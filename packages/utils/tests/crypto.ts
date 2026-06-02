import { describe, expect, it } from "vitest";
import { Crypto, SudoMode } from "../dist/index.mjs";

describe("testing crypto operations", async () => {
	const PIN = "192168";
	const ENCRYPTION_DATA = "Hello World!";

	let enc: Awaited<ReturnType<typeof Crypto.encryptData>> | undefined;

	it("should be ArrayBuffer", async () => {
		expect(await Crypto.createMasterKey(PIN)).toBeInstanceOf(ArrayBuffer);
	});

	it("should be stored in localstorage", async () => {
		expect(localStorage.getItem("MASTER_KEY_ENC")).toBeTypeOf("string");
	});

	it("should be sudo mode", async () => {
		await SudoMode.enterSudo(PIN);

		expect(SudoMode.isSudo()).toBeTruthy();
	});

	it("should be encrypted", async () => {
		// biome-ignore lint: We know that master key is defined because of the previous test
		const key = await Crypto.keyFromArrayBuffer(SudoMode.masterKey!);
		enc = await Crypto.encryptData(ENCRYPTION_DATA, key);

		expect(enc.enc).toBeInstanceOf(ArrayBuffer);
	});

	it("should be decrypted", async () => {
		// biome-ignore lint: We know that master key is defined because of the previous test
		const key = await Crypto.keyFromArrayBuffer(SudoMode.masterKey!);
		// biome-ignore lint: We know that it is encrypted already because of the prior test
		const decrypted = await Crypto.decryptData(enc!.enc, enc!.iv, key);

		const decoder = new TextDecoder();
		const decoded = decoder.decode(decrypted);

		expect(decoded).toBe(ENCRYPTION_DATA);
	});

	it("should not decrypt but throw", async () => {
		const key = await Crypto.keyFromArrayBuffer(
			crypto.getRandomValues(new Uint8Array(16)).buffer,
		);

		// biome-ignore lint: We know that it is encrypted already because of the prior test
		await expect(Crypto.decryptData(enc!.enc, enc!.iv, key)).rejects.toThrow();
	});

	it("should exit sudo mode", async () => {
		SudoMode.exitSudo();

		expect(SudoMode.isSudo()).toBeFalsy();
		expect(SudoMode.masterKey).toBeUndefined();
	});

	it("should not enter sudo mode", async () => {
		await expect(SudoMode.enterSudo("861291")).resolves.toBeFalsy();
		expect(SudoMode.isSudo()).toBeFalsy();
	});
});
