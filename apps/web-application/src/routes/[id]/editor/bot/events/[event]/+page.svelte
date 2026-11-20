<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import type { LGraph } from "litegraph.js";
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import Editor from "$lib/Components/Editor/Editor.svelte";
import { Button } from "$lib/Components/ui/button";
import { SUPPORTED_EVENTS } from "$lib/Constants/SupportedEvents";
import { graphHasRoot } from "$lib/codegen/graph";

function safeDecode(value: string | undefined) {
	if (!value) return "";

	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

const id = $derived(page.params.id ?? "");
const eventName = $derived(safeDecode(page.params.event));
const event = $derived(
	SUPPORTED_EVENTS.find((entry) => entry.name === eventName),
);

let app = $state<Application | null>(null);
let initialLoad = $state<ReturnType<LGraph["serialize"]> | undefined>(undefined);
let loading = $state(true);
let loadError = $state<string | null>(null);
let savedAt = $state<Date | null>(null);

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

		if (!found || !event) return;

		const data = await found.getEventGraph(event.name);
		initialLoad = graphHasRoot(data, event.root.buildReferenceName())
			? (data as ReturnType<LGraph["serialize"]>)
			: undefined;
	} catch (cause) {
		loadError =
			cause instanceof Error ? cause.message : "Unable to load this event.";
	} finally {
		loading = false;
	}
}

async function save(data: ReturnType<LGraph["serialize"]>) {
	if (!app || !event) return;

	await app.updateEventGraph(event.name, data);
	await app.setEventEnabled(event.name, true);
	savedAt = new Date();
}
</script>

<svelte:head>
	<title>{event?.name ?? "Event"} · {app?.name ?? "Bot"}</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col">
	<div
		class="flex items-center justify-between gap-4 border-b border-white/5 bg-card/40 px-4 py-3"
	>
		<div class="flex min-w-0 items-center gap-3">
			<Button
				variant="ghost"
				size="sm"
				href={resolve("/[id]/editor/bot/events", { id })}
			>
				<ArrowLeft class="size-4" />
				Events
			</Button>
			<div class="min-w-0">
				<p class="truncate text-sm font-medium">
					{event?.name ?? "Unknown event"}
				</p>
				<p class="truncate text-xs text-muted-foreground">
					{event?.intentsRequired?.join(", ") || "No intents required"}
				</p>
			</div>
		</div>
		<p class="shrink-0 text-xs text-muted-foreground">
			{#if savedAt}
				Saved {savedAt.toLocaleTimeString()}
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
			<Button
				variant="outline"
				href={resolve("/[id]/editor/bot/events", { id })}
			>
				Back to events
			</Button>
		</div>
	{:else if !app}
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="text-sm text-muted-foreground">
				This application does not exist in the local workspace.
			</p>
			<Button
				variant="outline"
				href={resolve("/[id]/editor/bot/events", { id })}
			>
				Back to events
			</Button>
		</div>
	{:else if !event}
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="text-sm text-muted-foreground">
				That event is not supported by this version of DisFlow.
			</p>
			<Button
				variant="outline"
				href={resolve("/[id]/editor/bot/events", { id })}
			>
				Back to events
			</Button>
		</div>
	{:else}
		<div class="min-h-0 flex-1">
			<Editor
				nodes={event.nodes}
				root={event.root}
				{initialLoad}
				onSave={save}
			/>
		</div>
	{/if}
</div>
