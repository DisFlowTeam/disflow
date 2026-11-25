import type { LGraphCanvas } from "litegraph.js";

export interface FrameLimitOptions {
	/**
	 * Set the max FPS
	 */
	maxFps?: number;
	/**
	 * Stop drawing while the tab is hidden or the window is not focused
	 */
	pauseWhenHidden?: boolean;
}

const DEFAULT_MAX_FPS = 30;

// replace litegraph's render with our own one
export function limitFrameRate(
	canvas: LGraphCanvas,
	{
		maxFps = DEFAULT_MAX_FPS,
		pauseWhenHidden = true,
	}: FrameLimitOptions = {},
) {
	canvas.stopRendering();

	const interval = maxFps > 0 ? 1000 / maxFps : 0;
	const ownerDocument = canvas.canvas?.ownerDocument ?? document;
	const ownerWindow = ownerDocument.defaultView ?? window;

	let handle: number | undefined;
	let lastDraw = 0;
	let running = false;

	const frame = (time: number) => {
		if (!running) return;

		handle = ownerWindow.requestAnimationFrame(frame);

		if (interval > 0 && time - lastDraw < interval) return;

		lastDraw = time;
		canvas.draw();
	};

	const start = () => {
		if (running) return;

		running = true;
		lastDraw = 0;
		handle = ownerWindow.requestAnimationFrame(frame);
	};

	const stop = () => {
		running = false;

		if (handle !== undefined) {
			ownerWindow.cancelAnimationFrame(handle);
			handle = undefined;
		}
	};

	const onVisibilityChange = () => {
		if (ownerDocument.hidden) stop();
		else start();
	};

	const onBlur = () => stop();
	const onFocus = () => {
		if (!ownerDocument.hidden) start();
	};

	if (pauseWhenHidden) {
		ownerDocument.addEventListener("visibilitychange", onVisibilityChange);
		ownerWindow.addEventListener("blur", onBlur);
		ownerWindow.addEventListener("focus", onFocus);
	}

	start();

	return () => {
		stop();

		ownerDocument.removeEventListener("visibilitychange", onVisibilityChange);
		ownerWindow.removeEventListener("blur", onBlur);
		ownerWindow.removeEventListener("focus", onFocus);
	};
}
