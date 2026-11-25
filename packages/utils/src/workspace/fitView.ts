import type { LGraph, LGraphCanvas, LGraphNode } from "litegraph.js";

export interface FitViewOptions {
	padding?: number;
	maxScale?: number;
	ignore?: (node: LGraphNode) => boolean;
}

type GraphInternals = { _nodes?: LGraphNode[] };

/** Centre and zoom the canvas */
export function fitView(
	canvas: LGraphCanvas,
	graph: LGraph,
	{ padding = 0.9, maxScale = 1, ignore }: FitViewOptions = {},
) {
	const nodes = (graph as unknown as GraphInternals)._nodes ?? [];
	const included = ignore ? nodes.filter((node) => !ignore(node)) : nodes;
	const visible = included.length > 0 ? included : nodes;

	if (visible.length === 0) return;
	if (canvas.canvas.width === 0 || canvas.canvas.height === 0) return;

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const node of visible) {
		const [x, y, width, height] = node.getBounding(undefined, true);

		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x + width);
		maxY = Math.max(maxY, y + height);
	}

	const width = Math.max(maxX - minX, 1);
	const height = Math.max(maxY - minY, 1);

	const scale = Math.min(
		(canvas.canvas.width / width) * padding,
		(canvas.canvas.height / height) * padding,
		maxScale,
	);

	const ds = canvas.ds;
	ds.scale = Math.max(ds.min_scale, Math.min(scale, ds.max_scale));
	ds.offset[0] = canvas.canvas.width / (2 * ds.scale) - (minX + width / 2);
	ds.offset[1] = canvas.canvas.height / (2 * ds.scale) - (minY + height / 2);

	canvas.setDirty(true, true);
}
