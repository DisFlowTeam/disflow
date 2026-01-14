<script lang="ts">
	import { onMount } from 'svelte';
	import { createEditor, getGraph } from '@disflow-team/utils';
	import 'highlight.js/styles/vs.css';
	import 'litegraph.js/css/litegraph.css';
	import { LGraphCanvas, LiteGraph } from 'litegraph.js';
	import { JavaScriptGenerator, OnProgramStartNode } from '@disflow-team/code-gen';
	import { FlowIOTypes } from '@disflow-team/code-gen';
	import * as Nodes from './Nodes';
	import { FlowIOColor } from './Nodes/Colors';
	import { NodeCategoryColor } from './Nodes/Colors';
	import { ProjectNode } from '$lib/Gun';

	let {
		project,
		commandId
	}: {
		project: string | ProjectNode;
		commandId?: string;
	} = $props();

	const originalAddItem = LiteGraph.ContextMenu.prototype.addItem;

	LiteGraph.ContextMenu.prototype.addItem = function (name, value, options) {
		const element = originalAddItem.call(this, name, value, options) as HTMLDivElement | undefined;

		if (element && element.classList.contains('has_submenu')) {
			const key = name.replaceAll(' ', '');
			if (key in NodeCategoryColor) {
				const color = NodeCategoryColor[key as keyof typeof NodeCategoryColor];
				element.style.borderRightColor = color;
			}
		}

		return element;
	};

	LiteGraph.clearRegisteredTypes();
	// hljs.registerLanguage('javascript', javascript);
	// hljs.registerLanguage('json', json);

	const engine = new JavaScriptGenerator();

	OnProgramStartNode.forEngine(engine);
	LiteGraph.registerNodeType('Events/Start', OnProgramStartNode);

	for (const Node of Object.values(Nodes)) {
		Node.forEngine(engine);
		LiteGraph.registerNodeType(Node.buildReferenceName(), Node);
	}

	let canvas: HTMLCanvasElement;

	let flowColors: Record<string, string> = {};

	const flowValues = Object.values(FlowIOTypes);
	Object.keys(FlowIOTypes).forEach((v, i) => {
		// @ts-expect-error
		flowColors[flowValues[i]] = FlowIOColor[v];
	});

	onMount(async () => {
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;

		const { graph, canvas: c } = createEditor(
			canvas,
			{},
			{
				autoresize: false
			}
		);

		c.frame = 30;
		c.zoom_modify_alpha = false;

		Object.assign(LGraphCanvas.link_type_colors, flowColors);

		// @ts-ignore
		if (graph._nodes.length === 0) {
			const node = new OnProgramStartNode();

			node.pos = [canvas.width / 4, canvas.height / 2];

			graph.add(node);
		}

		// Load the from the database
		let graphData: object | undefined;
		const prjData = typeof project === 'string' ? new ProjectNode(project) : project;

		if (commandId) {
			const command = prjData.command(commandId);
			const d = await command.graph();
			try {
				if (d) graphData = JSON.parse(d);
			} catch (error) {
				console.log('Unable to parse graph data ...');
			}
		} else {
			const d = await prjData.graph();

			try {
				if (d) graphData = JSON.parse(d);
			} catch (error) {
				console.log('Unable to parse graph data ...');
			}
		}

		if (graphData) {
			graph.configure(graphData, false);
		}
	});

	async function save() {
		const graph = getGraph();

		const data = graph.serialize();

		if (data) {
			const prjData = typeof project === 'string' ? new ProjectNode(project) : project;

			if (commandId) {
				const command = prjData.command(commandId);

				command.saveGraph(data);
			} else {
				prjData.saveGraph(data);
			}
		}
	}
</script>

<div
	class="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] px-7 py-2 rounded-full ring-1 ring-white/5"
>
	<button class="btn-style" onclick={() => save()}>Save</button>
	<button class="btn-style" onclick={() => {
		save().then(() => window.history.back());
	}}>Save and Exit</button>
	<button onclick={() => window.history.back()} class="btn-style btn-danger">Exit</button>
</div>
<div class="flex h-[calc(100vh-5rem)] w-screen">
	<canvas bind:this={canvas} class="h-full w-screen"></canvas>
</div>

<style>
	@reference "../../../app.css";

	@layer {
		.btn-style {
			@apply text-blue-400 cursor-pointer border-blue-400 px-4 py-1 border-2 rounded-4xl hover:rounded-lg hover:text-blue-500 hover:border-blue-500 transition-all;
		}

		.btn-danger {
			@apply text-red-400 border-red-400 hover:text-red-500 hover:border-red-500;
		}
	}
</style>
