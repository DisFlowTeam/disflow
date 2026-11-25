import {
	type IWidget,
	LGraphCanvas,
	type LGraphNode,
	LiteGraph,
	type Vector2,
} from "litegraph.js";
import { notifyEditor } from "./notifications";

// Allows you to sanitize the widget inputs
export interface SanitisedWidgetOptions {
	sanitize?: (value: string) => string;
	sanitizeLabel?: string;
}

// litegraph does not type `LGraphNode.widgets`, even though it exists.
type WidgetNode = LGraphNode & { widgets?: IWidget[] };

const NOTICE_DELAY = 700;

let activeWidget: IWidget | null = null;
let installed = false;

function optionsOf(widget: IWidget | null): SanitisedWidgetOptions | null {
	const options = widget?.options as SanitisedWidgetOptions | undefined;
	return typeof options?.sanitize === "function" ? options : null;
}

function widgetUnderPos(node: WidgetNode, pos: Vector2) {
	const y = pos[1] - node.pos[1];
	const height = LiteGraph.NODE_WIDGET_HEIGHT;

	for (const widget of node.widgets ?? []) {
		if (!optionsOf(widget)) continue;

		const top = widget.last_y ?? 0;
		if (y >= top && y <= top + height) return widget;
	}

	return null;
}

/**
 * litegraph edits text widgets through a modal `.graphdialog` prompt
 * (`LGraphCanvas.prototype.prompt`), so there is no inline input to hook.
 *
 * These two wrappers let wigets declare a `sanitize` option.
 * keystroke -> sanitize -> cleanup -> send noice
 * prevents "huh? why can't I type 'amazing variable!!!!' in a variable field"
 *
 * Honestly, I think it's better for us to just fork litegraph at this point
 * and maintain it ourselves rather than continue to monkey patch it.
 */
export function installRenameAsYouType() {
	if (installed) return;
	installed = true;

	// The typings are stricter than the runtime (extra required argument,
	// missing `multiline`), so use the shapes litegraph actually calls with.
	const originalProcess = LGraphCanvas.prototype.processNodeWidgets as (
		this: LGraphCanvas,
		node: LGraphNode,
		pos: Vector2,
		event: Event,
	) => void;

	LGraphCanvas.prototype.processNodeWidgets = function (
		this: LGraphCanvas,
		node: LGraphNode,
		pos: Vector2,
		event: Event,
	) {
		const previous = activeWidget;
		activeWidget = widgetUnderPos(node as WidgetNode, pos);

		try {
			originalProcess.call(this, node, pos, event);
		} finally {
			activeWidget = previous;
		}
	};

	const originalPrompt = LGraphCanvas.prototype.prompt as (
		this: LGraphCanvas,
		title: string,
		value: string,
		callback: (value: string) => void,
		event: MouseEvent,
	) => HTMLDivElement;

	LGraphCanvas.prototype.prompt = function (
		this: LGraphCanvas,
		title: string,
		value: string,
		callback: (value: string) => void,
		event: MouseEvent,
	) {
		const options = optionsOf(activeWidget);
		const sanitize = options?.sanitize;

		if (!sanitize) {
			return originalPrompt.call(this, title, value, callback, event);
		}

		const label = options.sanitizeLabel ?? "Value";

		const dialog = originalPrompt.call(
			this,
			title,
			value,
			(raw: string) => callback?.(sanitize(String(raw))),
			event,
		);

		const input = dialog.querySelector<HTMLInputElement | HTMLTextAreaElement>(
			".value",
		);

		if (!input) return dialog;

		let timer: ReturnType<typeof setTimeout> | undefined;
		let rejected: string | null = null;

		input.addEventListener("input", () => {
			const raw = input.value;
			const clean = sanitize(raw);

			if (clean !== raw) {
				// Keep the caret where the user expects it.
				const caret = Math.min(
					input.selectionStart ?? clean.length,
					clean.length,
				);

				input.value = clean;
				input.setSelectionRange(caret, caret);

				rejected ??= raw;
			}

			clearTimeout(timer);
			timer = setTimeout(() => {
				if (!dialog.isConnected || rejected === null) return;

				if (rejected === input.value) {
					rejected = null;
					return;
				}

				notifyEditor(
					`${label} renamed`,
					`"${rejected}" was changed to "${input.value}" — names must be valid JavaScript identifiers.`,
				);
				rejected = null;
			}, NOTICE_DELAY);
		});

		return dialog;
	};
}
