<script lang="ts">
import { FlowIOTypes, OnProgramStartNode } from "@disflow-team/code-gen";
import { createEditor, getGraph } from "@disflow-team/utils";
import { onMount } from "svelte";
import "litegraph.js/css/litegraph.css";
import { type LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import { Button } from "$lib/Components/ui/button";
import * as Nodes from "./Nodes";
import { FlowIOColor, NodeCategoryColor } from "./Nodes/Colors";
import type { NodeClass } from "./Nodes/types";

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

let flowColors: Record<string, string> = {};

const flowValues = Object.values(FlowIOTypes);
Object.keys(FlowIOTypes).forEach((v, i) => {
	// @ts-expect-error
	flowColors[flowValues[i]] = FlowIOColor[v];
});

onMount(() => {
	LiteGraph.clearRegisteredTypes();

	const registeredTypes = new Set<string>(["Events/Start"]);

	LiteGraph.registerNodeType("Events/Start", OnProgramStartNode);

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

	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;

	const { graph, canvas: c } = createEditor(
		canvas,
		{},
		{
			autoresize: false,
		},
	);

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
});

async function saveGraph() {
	if (!onSave) return;

	saving = true;
	saveError = null;

	try {
		await onSave(getGraph().serialize());
	} catch (cause) {
		saveError =
			cause instanceof Error ? cause.message : "Unable to save this graph.";
	} finally {
		saving = false;
	}
}
</script>

<div class="relative flex h-full w-full">
	{#if onSave || saveError}
		<div class="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
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
			{#if saveError}
				<p
					class="max-w-xs rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-right text-xs text-red-300"
				>
					{saveError}
				</p>
			{/if}
		</div>
	{/if}
	<canvas bind:this={canvas} class="h-full w-full"></canvas>
</div>
