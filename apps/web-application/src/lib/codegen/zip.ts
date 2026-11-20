const encoder = new TextEncoder();

let crcTable: Uint32Array | undefined;

function getCrcTable() {
	if (crcTable) return crcTable;

	const table = new Uint32Array(256);

	for (let i = 0; i < 256; i++) {
		let value = i;

		for (let bit = 0; bit < 8; bit++) {
			value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
		}

		table[i] = value >>> 0;
	}

	crcTable = table;
	return table;
}

function crc32(data: Uint8Array) {
	const table = getCrcTable();
	let crc = 0xffffffff;

	for (const byte of data) {
		crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	}

	return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
	const time =
		(date.getHours() << 11) |
		(date.getMinutes() << 5) |
		(date.getSeconds() >> 1);
	const day =
		((date.getFullYear() - 1980) << 9) |
		((date.getMonth() + 1) << 5) |
		date.getDate();

	return { time, date: day };
}

/**
 * Build a store-only ZIP archive. Store-only keeps this dependency-free; the
 * generated bot is small enough that compression is not important.
 */
export function createZip(files: Record<string, string>): Blob {
	const entries = Object.entries(files).sort(([a], [b]) => a.localeCompare(b));
	const { time, date } = dosDateTime(new Date());
	const localChunks: Uint8Array<ArrayBuffer>[] = [];
	const centralChunks: Uint8Array<ArrayBuffer>[] = [];
	let offset = 0;

	for (const [name, content] of entries) {
		const nameBytes = encoder.encode(name);
		const data = encoder.encode(content);
		const crc = crc32(data);

		const local = new Uint8Array(30 + nameBytes.length);
		const localView = new DataView(local.buffer);

		localView.setUint32(0, 0x04034b50, true);
		localView.setUint16(4, 20, true);
		localView.setUint16(6, 0, true);
		localView.setUint16(8, 0, true);
		localView.setUint16(10, time, true);
		localView.setUint16(12, date, true);
		localView.setUint32(14, crc, true);
		localView.setUint32(18, data.length, true);
		localView.setUint32(22, data.length, true);
		localView.setUint16(26, nameBytes.length, true);
		localView.setUint16(28, 0, true);
		local.set(nameBytes, 30);

		localChunks.push(local, data);

		const central = new Uint8Array(46 + nameBytes.length);
		const centralView = new DataView(central.buffer);

		centralView.setUint32(0, 0x02014b50, true);
		centralView.setUint16(4, 20, true);
		centralView.setUint16(6, 20, true);
		centralView.setUint16(8, 0, true);
		centralView.setUint16(10, 0, true);
		centralView.setUint16(12, time, true);
		centralView.setUint16(14, date, true);
		centralView.setUint32(16, crc, true);
		centralView.setUint32(20, data.length, true);
		centralView.setUint32(24, data.length, true);
		centralView.setUint16(28, nameBytes.length, true);
		centralView.setUint16(30, 0, true);
		centralView.setUint16(32, 0, true);
		centralView.setUint16(34, 0, true);
		centralView.setUint16(36, 0, true);
		centralView.setUint32(38, 0, true);
		centralView.setUint32(42, offset, true);
		central.set(nameBytes, 46);

		centralChunks.push(central);
		offset += local.length + data.length;
	}

	const centralSize = centralChunks.reduce(
		(sum, chunk) => sum + chunk.length,
		0,
	);
	const end = new Uint8Array(22);
	const endView = new DataView(end.buffer);

	endView.setUint32(0, 0x06054b50, true);
	endView.setUint16(4, 0, true);
	endView.setUint16(6, 0, true);
	endView.setUint16(8, entries.length, true);
	endView.setUint16(10, entries.length, true);
	endView.setUint32(12, centralSize, true);
	endView.setUint32(16, offset, true);
	endView.setUint16(20, 0, true);

	return new Blob([...localChunks, ...centralChunks, end], {
		type: "application/zip",
	});
}

export function downloadZip(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");

	anchor.href = url;
	anchor.download = filename.endsWith(".zip") ? filename : `${filename}.zip`;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();

	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
