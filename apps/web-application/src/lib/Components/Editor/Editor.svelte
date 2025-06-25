<script lang="ts">
	import { onMount } from 'svelte';
	import { createEditor, getGraph } from '@disflow-team/utils';
	import 'litegraph.js/css/litegraph.css';
	import { LiteGraph } from 'litegraph.js';
	import * as Nodes from '$lib/Nodes';
	import Sidebar from './Sidebar.svelte';
	import Files from './SidebarComponents/File/Files.svelte';
	import { changeFile, currentFile } from './SidebarComponents/File/Switch';

	type SidebarTabs = "files";
	let currentSidebar: SidebarTabs = $state("files");

	LiteGraph.clearRegisteredTypes();

	for (const Node of Object.values(Nodes)) LiteGraph.registerNodeType(Node.buildName(), Node);

	let canvas: HTMLCanvasElement;
	let isInitialMount = true;

	$effect(() => {
		if(isInitialMount) {
			isInitialMount = false;
			return;
		}
		if(currentFile || (!Object.getPrototypeOf(currentFile) && Object.getPrototypeOf(currentFile) !== Object.prototype)) {
			const editor = getGraph();
			editor.configure(currentFile, false);
		}
	})

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
					main: '',
					commands: [
                        {
                            name: "ping",
                            file: ""
                        }
                    ],
					lastFile: "main"
				})
			);
		}

		const proj = localStorage.getItem("demo_project")!;
		const projJ = JSON.parse(proj);
		if(projJ.lastFile) {
			if(projJ.lastFile === "main") changeFile(projJ);
		}
	});
</script>

<div class="flex h-[calc(100vh-5rem)] w-screen border-gray-500 border-t-[1px]">
	{#if currentSidebar}
	<div class="w-[20%] h-full flex">
		<Sidebar />
		<div class="w-full h-full bg-slate-900 border-r-[1px] border-gray-500">
			{#if currentSidebar === "files"}
				<Files />
			{:else}
				<div class="flex items-center justify-center h-full text-gray-500">
					<p class="text-lg">No content for {currentSidebar} tab yet.</p>
				</div>
			{/if}
		</div>
	</div>
	{/if}
	<div class="w-full h-full">
		<div class="h-[5%] bg-slate-900 border-b-[1px] border-gray-500"></div>
		<canvas bind:this={canvas} class="h-[95%] w-full"></canvas>
	</div>
</div>
