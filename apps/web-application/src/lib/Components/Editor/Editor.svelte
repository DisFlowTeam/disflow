<script lang="ts">
import { FlowIOTypes, OnProgramStartNode } from "@disflow-team/code-gen";
import { createEditor, destroyEditor, fitView } from "@disflow-team/utils";
import Maximize2 from "@lucide/svelte/icons/maximize-2";
import { onMount } from "svelte";
import "litegraph.js/css/litegraph.css";
import { type LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import { Button } from "$lib/Components/ui/button";
import * as Nodes from "./Nodes";
import { FlowIOColor, NodeCategoryColor } from "./Nodes/Colors";
import { LEGACY_NODE_TYPES } from "./Nodes/legacy";
import type { NodeClass } from "./Nodes/types";
import { editorNotices } from "./notifications";
import { installRenameAsYouType } from "./renameAsYouType";

const originalAddItem = LiteGraph.ContextMenu.prototype.addItem;

const {
	initialLoad,
	nodes = Object.values(Nodes),
	root,
	onSave,
}: {
	initialLoad?: ReturnType<LGraph["serialize"]>;
	nodes?: NodeClass[];
	root?: NodeClass;
	onSave?: (data: ReturnType<LGraph["serialize"]>) => void | Promise<void>;
} = $props();

LiteGraph.ContextMenu.prototype.addItem = function (name, value, options) {
	const element = originalAddItem.call(this, name, value, options) as
		| HTMLDivElement
		| undefined;

	if (element?.classList.contains("has_submenu")) {
		const key = name.replaceAll(" ", "");
		if (key in NodeCategoryColor) {
			const color = NodeCategoryColor[key as keyof typeof NodeCategoryColor];
			element.style.borderRightColor = color;
		}
	}

	return element;
};

let saving = $state(false);
let saveError = $state<string | null>(null);

let canvas: HTMLCanvasElement;

let editorGraph: LGraph | undefined;
let editorCanvas: LGraphCanvas | undefined;

/** The event/command editors park their On Start root off-screen. */
function isParked(node: { pos: [number, number] }) {
	return node.pos[0] < -1000 && node.pos[1] < -1000;
}

function fitToNodes() {
	if (!editorCanvas || !editorGraph) return;

	fitView(editorCanvas, editorGraph, { ignore: isParked });
}

let flowColors: Record<string, string> = {};

const flowValues = Object.values(FlowIOTypes);
Object.keys(FlowIOTypes).forEach((v, i) => {
	// @ts-expect-error
	flowColors[flowValues[i]] = FlowIOColor[v];
});

onMount(() => {
	installRenameAsYouType();

	LiteGraph.clearRegisteredTypes();

	const registeredTypes = new Set<string>(["Events/Start"]);

	LiteGraph.registerNodeType("Events/Start", OnProgramStartNode);

	// Register old type names first so the canonical name wins `constructor.type`.
	for (const [type, Node] of LEGACY_NODE_TYPES) {
		LiteGraph.registerNodeType(type, Node);
		registeredTypes.add(type);
	}

	for (const Node of nodes) {
		const key = Node.buildReferenceName();
		if (registeredTypes.has(key)) continue;

		LiteGraph.registerNodeType(key, Node);
		registeredTypes.add(key);
	}

	if (root) {
		const key = root.buildReferenceName();
		if (!registeredTypes.has(key)) {
			LiteGraph.registerNodeType(key, root);
			registeredTypes.add(key);
		}
	}

	const initialRect = canvas.getBoundingClientRect();
	canvas.width = Math.max(1, Math.round(initialRect.width));
	canvas.height = Math.max(1, Math.round(initialRect.height));

	const { graph, canvas: c } = createEditor(
		canvas,
		{},
		{
			autoresize: false,
		},
		// A graph editor does not need a high frame rate; 30fps is plenty and
		// keeps the GPU cost low. Rendering pauses while the tab is hidden.
		{ maxFps: 30 },
	);

	// The canvas is sized by CSS, so layout changes alter its display box
	// without touching the drawing buffer. Keep both in sync.
	const resizeCanvas = () => {
		const box = canvas.getBoundingClientRect();
		const width = Math.max(1, Math.round(box.width));
		const height = Math.max(1, Math.round(box.height));

		if (width === canvas.width && height === canvas.height) return;

		c.resize(width, height);
	};

	const resizeObserver = new ResizeObserver(resizeCanvas);
	resizeObserver.observe(canvas);

	editorGraph = graph;
	editorCanvas = c;

	c.zoom_modify_alpha = false;

	Object.assign(LGraphCanvas.link_type_colors, flowColors);

	if (initialLoad) {
		graph.configure(initialLoad, false);
	} else if (
		// @ts-expect-error Graph contains the "private" property _nodes
		graph._nodes.length === 0
	) {
		const start = new OnProgramStartNode();

		if (root) {
			// graphToCode requires an On Start root; keep it out of the way for
			// per-event/per-command editors.
			start.pos = [-1400, -1400];
			graph.add(start);

			const eventRoot = new root();

			eventRoot.pos = [canvas.width / 4, canvas.height / 2];
			graph.add(eventRoot);
		} else {
			start.pos = [canvas.width / 4, canvas.height / 2];
			graph.add(start);
		}
	}

	fitToNodes();

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key.toLowerCase() !== "f" || event.ctrlKey || event.metaKey) return;
		if (
			event.target instanceof HTMLElement &&
			event.target.closest("input, textarea, [contenteditable]")
		)
			return;

		fitToNodes();
	};

	window.addEventListener("keydown", onKeyDown);

	return () => {
		window.removeEventListener("keydown", onKeyDown);
		resizeObserver.disconnect();
		destroyEditor(c);
		editorGraph = undefined;
		editorCanvas = undefined;
	};
});

async function saveGraph() {
	if (!onSave || !editorGraph) return;

	saving = true;
	saveError = null;

	try {
		await onSave(editorGraph.serialize());
	} catch (cause) {
		saveError =
			cause instanceof Error ? cause.message : "Unable to save this graph.";
	} finally {
		saving = false;
	}
}
</script>

<div class="relative flex h-full w-full">
	<div class="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={fitToNodes}
				title="Fit view (F)"
				aria-label="Fit view"
			>
				<Maximize2 class="size-3.5" />
			</Button>
			{#if onSave}
				<Button
					variant="outline"
					size="sm"
					disabled={saving}
					onclick={saveGraph}
				>
					{saving ? "Saving…" : "Save"}
				</Button>
			{/if}
		</div>
		{#if saveError}
			<p
				class="max-w-xs rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-right text-xs text-red-300"
			>
				{saveError}
			</p>
		{/if}
	</div>
	<canvas bind:this={canvas} class="h-full w-full"></canvas>

	{#if $editorNotices.length > 0}
		<div
			class="pointer-events-none absolute right-4 bottom-4 z-30 flex w-72 flex-col gap-2"
		>
			{#each $editorNotices as notice (notice.id)}
				<div
					class="pointer-events-auto rounded-lg border border-blue-500/25 bg-card/95 px-3 py-2 shadow-xl backdrop-blur"
				>
					<p class="text-xs font-medium text-blue-300">{notice.title}</p>
					<p class="mt-0.5 text-xs text-muted-foreground">{notice.message}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
