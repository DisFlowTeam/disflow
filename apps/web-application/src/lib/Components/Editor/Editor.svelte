<script lang="ts">
	import { onMount } from 'svelte';
	import { createEditor } from '@disflow-team/utils';
	import 'litegraph.js/css/litegraph.css';
	import { LiteGraph } from 'litegraph.js';
	import * as Nodes from '$lib/Nodes';
	import Files from './SidebarComponents/File/Files.svelte';

	type SidebarTabs = "files";
	let currentSidebar: SidebarTabs = $state("files");

	LiteGraph.clearRegisteredTypes();

	for (const Node of Object.values(Nodes)) LiteGraph.registerNodeType(Node.buildName(), Node);

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;

		createEditor(
			canvas,
			{},
			{
				autoresize: false
			}
		);

		if (window.location.pathname === '/demo' && !localStorage.getItem('demo_project')) {
			localStorage.setItem(
				'demo_project',
				JSON.stringify({
					name: 'demo',
					index: '',
					commands: [
                        {
                            name: "ping",
                            file: ""
                        }
                    ]
				})
			);
		}
	});
</script>

<div class="flex h-[calc(100vh-5rem)] w-screen border-gray-500 border-t-[1px]">
	<div class="w-[20%] h-full flex">
		<div class="w-[20%] h-full bg-slate-900 border-r-[1px] border-gray-500"></div>
		<div class="w-[80%] h-full bg-slate-900 border-r-[1px] border-gray-500">
			{#if currentSidebar === "files"}
				<Files />
			{/if}
		</div>
	</div>
	<div class="w-[80%] h-full">
		<div class="h-[5%] bg-slate-900 border-b-[1px] border-gray-500"></div>
		<canvas bind:this={canvas} class="h-[95%] w-full"></canvas>
	</div>
</div>
