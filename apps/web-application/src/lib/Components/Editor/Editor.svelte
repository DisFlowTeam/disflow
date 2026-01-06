<script lang="ts">
	import { onMount } from 'svelte';
	import { createEditor, getGraph } from '@disflow-team/utils';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/vs.css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import 'litegraph.js/css/litegraph.css';
	import { LGraphCanvas, LiteGraph } from 'litegraph.js';
	import { JavaScriptGenerator, OnProgramStartNode } from '@disflow-team/code-gen';
	import { FlowIOTypes } from '@disflow-team/code-gen';
	import * as Nodes from './Nodes';
	import { FlowIOColor } from './Nodes/Colors';
	import { NodeCategoryColor } from './Nodes/Colors';

	const originalAddItem = LiteGraph.ContextMenu.prototype.addItem;

	LiteGraph.ContextMenu.prototype.addItem = function (name, value, options) {
		const element = originalAddItem.call(
			this,
			name,
			value,
			options
		) as HTMLDivElement | undefined;

		if (element && element.classList.contains('has_submenu')) {
			const key = name.replaceAll(" ", "");
			if (key in NodeCategoryColor) {
				
				const color = NodeCategoryColor[key as keyof typeof NodeCategoryColor];
    			element.style.borderRightColor = color;
			}
		}

		return element;
	};


	let code = '';

	LiteGraph.clearRegisteredTypes();
	hljs.registerLanguage('javascript', javascript);

	const engine = new JavaScriptGenerator();

	OnProgramStartNode.forEngine(engine);
	LiteGraph.registerNodeType('Events/Start', OnProgramStartNode);

	for (const Node of Object.values(Nodes)) {
		Node.forEngine(engine);
		LiteGraph.registerNodeType(Node.buildReferenceName(), Node);
	}

	let canvas: HTMLCanvasElement;
	let dialog: HTMLDialogElement;

	let flowColors: Record<string, string> = {};

	const flowValues = Object.values(FlowIOTypes);
	Object.keys(FlowIOTypes).forEach((v, i) => {
		// @ts-expect-error
		flowColors[flowValues[i]] = FlowIOColor[v];
	});

	onMount(() => {
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
	});
</script>

<div class="flex h-[calc(100vh-5rem)] w-screen">
	<button
		class="absolute top-24 right-11 bg-blue-700 rounded-lg p-2"
		onclick={() => {
			code = hljs.highlight(engine.graphToCode(getGraph()), { language: 'javascript' }).value;
			dialog.showModal();
		}}>Generate Code</button
	>
	<canvas bind:this={canvas} class="h-full w-screen"></canvas>
</div>

<dialog
	bind:this={dialog}
	open={false}
	class="h-[calc(100vh-5rem)] max-w-[100vw] p-3 w-screen absolute top-20 left-0 bg-gray-900"
>
	<div class="w-11/12 h-11/12 mx-auto rounded-md bg-gray-950 p-3 text-gray-400">
		<pre><code>{@html code}</code></pre>
	</div>
	<div class="w-11/12 h-1/12 mx-auto flex items-center">
		<button
			class="bg-blue-700 py-2 px-6 rounded-md"
			onclick={() => {
				dialog.close();
			}}>Close</button
		>
	</div>
</dialog>
