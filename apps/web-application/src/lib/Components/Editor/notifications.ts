import { writable } from "svelte/store";

export interface EditorNotice {
	id: number;
	title: string;
	message: string;
}

/** Small transient messages rendered by `Editor.svelte`. */
export const editorNotices = writable<EditorNotice[]>([]);

const NOTICE_LIFETIME = 6000;
let nextId = 1;

export function notifyEditor(title: string, message: string) {
	const id = nextId++;

	editorNotices.update((notices) => [...notices, { id, title, message }]);
	setTimeout(() => dismissEditorNotice(id), NOTICE_LIFETIME);

	return id;
}

export function dismissEditorNotice(id: number) {
	editorNotices.update((notices) =>
		notices.filter((notice) => notice.id !== id),
	);
}
