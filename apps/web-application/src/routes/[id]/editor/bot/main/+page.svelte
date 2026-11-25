<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import FileCode from "@lucide/svelte/icons/file-code";
import type { LGraph } from "litegraph.js";
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import Editor from "$lib/Components/Editor/Editor.svelte";
import { Button } from "$lib/Components/ui/button";
import { MAIN_NODES } from "$lib/Constants/MainNodes";
import { graphHasRoot } from "$lib/codegen/graph";

const id = $derived(page.params.id ?? "");

let app = $state<Application | null>(null);
let initialLoad = $state<ReturnType<LGraph["serialize"]> | undefined>(undefined);
let loading = $state(true);
let loadError = $state<string | null>(null);
let savedAt = $state<Date | null>(null);
let hasStoredGraph = $state(false);

onMount(() => {
	void load();
});

async function load() {
	loading = true;
	loadError = null;

	try {
		if (!id) return;

		const found = await createSingleton().appManager.get(id);
		app = found ?? null;

		if (!found) return;

		const data = await found.getMainGraph();
		hasStoredGraph = graphHasRoot(data, "Events/Start");
		initialLoad = hasStoredGraph
			? (data as ReturnType<LGraph["serialize"]>)
			: undefined;
	} catch (cause) {
		loadError =
			cause instanceof Error ? cause.message : "Unable to load the main file.";
	} finally {
		loading = false;
	}
}

async function save(data: ReturnType<LGraph["serialize"]>) {
	if (!app) return;

	await app.updateMainGraph(data);
	savedAt = new Date();
}
</script>

<svelte:head>
	<title>Main file · {app?.name ?? "Bot"}</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col">
	<div
		class="flex items-center justify-between gap-4 border-b border-white/5 bg-card/40 px-4 py-3"
	>
		<div class="flex min-w-0 items-center gap-3">
			<div
				class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400"
			>
				<FileCode class="size-4" />
			</div>
			<div class="min-w-0">
				<p class="truncate text-sm font-medium">Main file</p>
				<p class="truncate text-xs text-muted-foreground">
					Startup logic that runs once before {app?.name ?? "the bot"} logs
					in.
				</p>
			</div>
		</div>
		<p class="shrink-0 text-xs text-muted-foreground">
			{#if savedAt}
				Saved {savedAt.toLocaleTimeString()}
			{:else if hasStoredGraph}
				Stored locally
			{:else}
				Not saved yet
			{/if}
		</p>
	</div>

	{#if loading}
		<div class="flex flex-1 items-center justify-center text-sm text-muted-foreground">
			Loading editor…
		</div>
	{:else if loadError}
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="text-sm text-red-300">{loadError}</p>
			<Button variant="outline" href={resolve("/[id]/editor", { id })}>
				Back to overview
			</Button>
		</div>
	{:else if !app}
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="text-sm text-muted-foreground">
				This application does not exist in the local workspace.
			</p>
			<Button variant="outline" href={resolve("/[id]/editor", { id })}>
				Back to overview
			</Button>
		</div>
	{:else}
		<div class="min-h-0 flex-1">
			<Editor nodes={[...MAIN_NODES]} {initialLoad} onSave={save} />
		</div>
	{/if}
</div>
