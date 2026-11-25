import JSZip from "jszip";

/** Build a .zip containing the generated project files. */
export async function createZip(files: Record<string, string>): Promise<Blob> {
	const zip = new JSZip();

	const entries = Object.entries(files).sort(([a], [b]) => a.localeCompare(b));

	for (const [name, content] of entries) {
		zip.file(name, content);
	}

	return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
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
