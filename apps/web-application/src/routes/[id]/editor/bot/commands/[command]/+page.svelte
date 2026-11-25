<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import type { LGraph } from "litegraph.js";
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import Editor from "$lib/Components/Editor/Editor.svelte";
import { OnCommand } from "$lib/Components/Editor/Nodes/Events";
import { Button } from "$lib/Components/ui/button";
import { COMMAND_NODES } from "$lib/Constants/OnCommand";
import { graphHasRoot } from "$lib/codegen/graph";

type CommandSummary = {
	name: string;
	description: string;
};

function safeDecode(value: string | undefined) {
	if (!value) return "";

	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}



const id = $derived(page.params.id ?? "");
const commandName = $derived(safeDecode(page.params.command));

let app = $state<Application | null>(null);
let command = $state<CommandSummary | null>(null);
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

		if (!found) return;

		const commands = await found.bulkGetCommands();
		command = commands.find((entry) => entry.name === commandName) ?? null;

		if (!command) return;

		const data = await found.getCommandGraph(commandName);
		initialLoad = graphHasRoot(data, "Events/On Command")
			? (data as ReturnType<LGraph["serialize"]>)
			: undefined;
	} catch (cause) {
		loadError =
			cause instanceof Error ? cause.message : "Unable to load this command.";
	} finally {
		loading = false;
	}
}

async function save(data: ReturnType<LGraph["serialize"]>) {
	if (!app || !command) return;

	await app.updateCommandData(command.name, data);
	savedAt = new Date();
}
</script>

<svelte:head>
	<title>/{command?.name ?? "Command"} · {app?.name ?? "Bot"}</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col">
	<div
		class="flex items-center justify-between gap-4 border-b border-white/5 bg-card/40 px-4 py-3"
	>
		<div class="flex min-w-0 items-center gap-3">
			<Button
				variant="ghost"
				size="sm"
				href={resolve("/[id]/editor/bot/commands", { id })}
			>
				<ArrowLeft class="size-4" />
				Commands
			</Button>
			<div class="min-w-0">
				<p class="truncate text-sm font-medium">
					/{command?.name ?? "Unknown command"}
				</p>
				<p class="truncate text-xs text-muted-foreground">
					{command?.description || "No description"}
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
				href={resolve("/[id]/editor/bot/commands", { id })}
			>
				Back to commands
			</Button>
		</div>
	{:else if !app}
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="text-sm text-muted-foreground">
				This application does not exist in the local workspace.
			</p>
			<Button
				variant="outline"
				href={resolve("/[id]/editor/bot/commands", { id })}
			>
				Back to commands
			</Button>
		</div>
	{:else if !command}
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="text-sm text-muted-foreground">
				That command no longer exists in this workspace.
			</p>
			<Button
				variant="outline"
				href={resolve("/[id]/editor/bot/commands", { id })}
			>
				Back to commands
			</Button>
		</div>
	{:else}
		<div class="min-h-0 flex-1">
			<Editor
				nodes={[...COMMAND_NODES]}
				root={OnCommand}
				{initialLoad}
				onSave={save}
			/>
		</div>
	{/if}
</div>
