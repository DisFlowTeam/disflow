import { LGraph, LGraphCanvas } from "litegraph.js";
import {
	type FrameLimitOptions,
	limitFrameRate,
} from "./renderLoop";
import { applyCanvasTheme, applyLiteGraphTheme } from "./theme";

export type LGraphCanvasOptions = ConstructorParameters<typeof LGraphCanvas>[2];

let graph: LGraph | undefined;
let canvas: LGraphCanvas | undefined;
let stopRenderLoop: (() => void) | undefined;

/**
 * The graph of the editor that is currently on screen.
 *
 * Prefer the value returned by `createEditor`: this exists for code that cannot
 * receive it. It is cleared by `destroyEditor`.
 */
export function getGraph(o?: object) {
	if (!graph) graph = new LGraph(o);
	return graph;
}

export function constructCanvas(
	...args: ConstructorParameters<typeof LGraphCanvas>
) {
	canvas = new LGraphCanvas(...args);
	return canvas;
}

export function getCanvas() {
	if (!canvas)
		throw new Error("Canvas not yet initialized. Call `constructCanvas` first");
	return canvas;
}

/**
 * Create a graph and canvas for one editor instance.
 *
 * Every call starts from a **new** `LGraph`. Editors are remounted on every
 * route change, so reusing a graph would leak the previous file's nodes into
 * the next one (for example, opening a command editor and then the main file).
 */
export function createEditor(
	element: HTMLCanvasElement,
	graphOptions?: object,
	canvasOptions: LGraphCanvasOptions = { autoresize: true },
	renderOptions?: FrameLimitOptions,
) {
	// Global constants must be set before the canvas reads them.
	applyLiteGraphTheme();

	// Drop any editor that is still around (e.g. a remount without cleanup).
	destroyEditor();

	graph = new LGraph(graphOptions);
	canvas = constructCanvas(element, graph, canvasOptions);

	applyCanvasTheme(canvas);
	stopRenderLoop = limitFrameRate(canvas, renderOptions);

	return { graph, canvas };
}

/**
 * Stop the render loop, detach the DOM listeners and forget the references.
 *
 * Pass the canvas returned by `createEditor` when cleaning up a specific
 * instance: if a newer editor has already taken over, this becomes a no-op.
 */
export function destroyEditor(target?: LGraphCanvas) {
	if (!canvas) return;
	if (target && target !== canvas) return;

	const current = canvas;

	// Clear the references first so a second call cannot unbind twice.
	canvas = undefined;
	graph = undefined;

	stopRenderLoop?.();
	stopRenderLoop = undefined;

	current.stopRendering();
	current.unbindEvents();
}
