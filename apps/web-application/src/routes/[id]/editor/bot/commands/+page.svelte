<script lang="ts">
import {
	type Application,
	type CommandOption,
	createSingleton,
} from "@disflow-team/local-data";
import Hash from "@lucide/svelte/icons/hash";
import Plus from "@lucide/svelte/icons/plus";
import Search from "@lucide/svelte/icons/search";
import Slash from "@lucide/svelte/icons/slash";
import SlidersHorizontal from "@lucide/svelte/icons/sliders-horizontal";
import SquarePen from "@lucide/svelte/icons/square-pen";
import Terminal from "@lucide/svelte/icons/terminal";
import Trash2 from "@lucide/svelte/icons/trash-2";
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import CommandOptionsDialog from "$lib/Components/Commands/CommandOptionsDialog.svelte";
import BotPageHeader from "$lib/Components/Dashboard/BotPageHeader.svelte";
import EmptyState from "$lib/Components/Dashboard/EmptyState.svelte";
import ExportBotButton from "$lib/Components/Dashboard/ExportBotButton.svelte";
import { Button } from "$lib/Components/ui/button";
import * as Dialog from "$lib/Components/ui/dialog";
import Input from "$lib/Components/ui/input/input.svelte";
import Label from "$lib/Components/ui/label/label.svelte";
import Textarea from "$lib/Components/ui/textarea/textarea.svelte";
import { graphHasRoot } from "$lib/codegen/graph";

type CommandSummary = {
	name: string;
	description: string;
	options: CommandOption[];
};

const id = $derived(page.params.id ?? "");

let app = $state<Application | null>(null);
let commands = $state<CommandSummary[]>([]);
let configuredCommands = $state<string[]>([]);
let loading = $state(true);
let search = $state("");

let createOpen = $state(false);
let name = $state("");
let description = $state("");
let formError = $state<string | null>(null);
let creating = $state(false);

let deleteOpen = $state(false);
let selectedCommand = $state<CommandSummary | null>(null);
let deleteError = $state<string | null>(null);
let deleting = $state(false);

let optionsOpen = $state(false);
let selectedOptionsCommand = $state<CommandSummary | null>(null);

const configuredSet = $derived(new Set(configuredCommands));

const filteredCommands = $derived.by(() => {
	const query = search.trim().toLowerCase();
	const list = query
		? commands.filter((command) =>
				`${command.name} ${command.description}`
					.toLowerCase()
					.includes(query),
			)
		: commands;

	return [...list].sort((a, b) => a.name.localeCompare(b.name));
});

const trimmedName = $derived(name.trim());
const trimmedDescription = $derived(description.trim());
const nameTaken = $derived(
	commands.some((command) => command.name === trimmedName),
);
const canCreate = $derived(
	/^[a-z0-9_-]{1,32}$/.test(trimmedName) &&
		trimmedDescription.length > 0 &&
		trimmedDescription.length <= 100 &&
		!nameTaken &&
		!creating,
);

onMount(() => {
	void load();
});

async function load(showLoading = true) {
	if (showLoading) loading = true;

	try {
		if (!id) {
			app = null;
			commands = [];
			configuredCommands = [];
			return;
		}

		const found = await createSingleton().appManager.get(id);
		app = found ?? null;
		commands = found ? await found.bulkGetCommands() : [];

		if (!found) {
			configuredCommands = [];
			return;
		}

		const graphs = await Promise.all(
			commands.map((command) => found.getCommandGraph(command.name)),
		);

		configuredCommands = commands
			.filter((_, index) =>
				graphHasRoot(graphs[index], "Events/On Command"),
			)
			.map((command) => command.name);
	} finally {
		if (showLoading) loading = false;
	}
}

function handleNameInput(event: Event) {
	const input = event.currentTarget as HTMLInputElement;

	name = input.value
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9_-]/g, "")
		.replace(/-{2,}/g, "-")
		.slice(0, 32);

	formError = null;
}

function openCreate() {
	name = "";
	description = "";
	formError = null;
	createOpen = true;
}

function resetCreate() {
	name = "";
	description = "";
	formError = null;
}

async function submitCommand() {
	if (!app) return;

	formError = null;

	if (!/^[a-z0-9_-]{1,32}$/.test(trimmedName)) {
		formError =
			"Use 1-32 lowercase letters, numbers, hyphens or underscores for the command name.";
		return;
	}

	if (trimmedDescription.length === 0) {
		formError = "A command description is required.";
		return;
	}

	if (trimmedDescription.length > 100) {
		formError = "Descriptions must be 100 characters or fewer.";
		return;
	}

	if (nameTaken) {
		formError = `A command named /${trimmedName} already exists.`;
		return;
	}

	creating = true;

	try {
		await app.createCommand({
			name: trimmedName,
			description: trimmedDescription,
		});

		createOpen = false;
		resetCreate();
		await load(false);
	} catch (cause) {
		formError =
			cause instanceof Error
				? cause.message
				: "Something went wrong while creating the command.";
	} finally {
		creating = false;
	}
}

function openOptions(command: CommandSummary) {
	selectedOptionsCommand = command;
	optionsOpen = true;
}

function requestDelete(command: CommandSummary) {
	selectedCommand = command;
	deleteError = null;
	deleteOpen = true;
}

async function confirmDelete() {
	if (!app || !selectedCommand) return;

	deleting = true;
	deleteError = null;

	try {
		await app.deleteCommand(selectedCommand.name);
		deleteOpen = false;
		selectedCommand = null;
		await load(false);
	} catch (cause) {
		deleteError =
			cause instanceof Error
				? cause.message
				: "Something went wrong while deleting the command.";
	} finally {
		deleting = false;
	}
}
</script>

<svelte:head>
	<title>{app?.name ?? "Bot"} · Slash commands</title>
</svelte:head>

<div class="min-h-full pb-16">
	<div
		class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8"
	>
		<BotPageHeader
			botName={app?.name ?? "Loading application"}
			avatar={app?.schema.avatar}
			title="Slash commands"
			description="Create the slash commands your bot exposes in Discord. Everything is stored locally in this workspace."
			meta={loading
				? []
				: [
						`${commands.length} ${commands.length === 1 ? "command" : "commands"}`,
						"Slash commands only",
						"Stored on this device",
					]}
		>
			<Button
				class="h-10 gap-2 bg-blue-600 px-4 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
				onclick={openCreate}
				disabled={!app || loading}
			>
				<Plus class="size-4" />
				New command
			</Button>
			<ExportBotButton {app} />
		</BotPageHeader>

		<div
			class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="relative w-full sm:max-w-xs">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					bind:value={search}
					placeholder="Search commands"
					class="h-10 pl-9"
				/>
			</div>
			<p class="text-xs text-muted-foreground">
				Showing <span class="font-medium text-foreground"
					>{filteredCommands.length}</span
				> of {commands.length}
			</p>
		</div>

		{#if loading}
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each [0, 1, 2] as item (item)}
					<div
						class="h-44 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
					></div>
				{/each}
			</div>
		{:else if !app}
			<EmptyState
				icon={Terminal}
				title="Application not found"
				description="This application does not exist in the local workspace. It may have been deleted."
			/>
		{:else if commands.length === 0}
			<EmptyState
				icon={Terminal}
				title="No slash commands yet"
				description="Slash commands let users invoke your bot with a / command in Discord. Create your first one to get started."
			>
				<Button
					class="gap-2 bg-blue-600 text-white hover:bg-blue-500"
					onclick={openCreate}
				>
					<Plus class="size-4" />
					Create your first command
				</Button>
			</EmptyState>
		{:else if filteredCommands.length === 0}
			<EmptyState
				icon={Search}
				title="No matching commands"
				description="Try a different name or description, or clear the search to see every command."
			>
				<Button variant="outline" onclick={() => (search = "")}>
					Clear search
				</Button>
			</EmptyState>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each filteredCommands as command (command.name)}
					<article
						class="group flex flex-col gap-4 rounded-xl border border-white/5 bg-card/60 p-5 transition-colors hover:border-blue-500/30 hover:bg-card"
					>
						<div class="flex items-start justify-between gap-3">
							<div class="flex min-w-0 items-center gap-3">
								<div
									class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400"
								>
									<Slash class="size-4" />
								</div>
								<div class="min-w-0">
									<h2 class="truncate font-mono text-sm font-semibold">
										/{command.name}
									</h2>
									<p
										class="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
									>
										Slash command{#if (command.options?.length ?? 0) > 0}
											· {command.options.length} option{command.options
												.length === 1
												? ""
												: "s"}{/if}
									</p>
								</div>
							</div>
							<span
								class="rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#b3bcff] uppercase"
								>Discord</span
							>
						</div>

						<p
							class="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground"
						>
							{command.description || "No description provided."}
						</p>

						<div
							class="mt-auto flex items-center justify-between border-t border-white/5 pt-3"
						>
							<span class="flex items-center gap-2">
								<span
									class="flex items-center gap-1.5 text-[11px] text-muted-foreground"
								>
									<Hash class="size-3.5" />
									Saved locally
								</span>
								{#if configuredSet.has(command.name)}
									<span
										class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-emerald-300 uppercase"
									>
										Graph
									</span>
								{/if}
							</span>
							<div class="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon-sm"
									class="text-muted-foreground hover:text-foreground"
									aria-label={`Edit options for /${command.name}`}
									title={`Edit options for /${command.name}`}
									onclick={() => openOptions(command)}
								>
									<SlidersHorizontal class="size-4" />
								</Button>
								<Button
									href={resolve("/[id]/editor/bot/commands/[command]", {
										id,
										command: command.name,
									})}
									variant="ghost"
									size="sm"
									class="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
								>
									<SquarePen class="size-3.5" />
									Edit
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									class="text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
									aria-label={`Delete /${command.name}`}
									title={`Delete /${command.name}`}
									onclick={() => requestDelete(command)}
								>
									<Trash2 class="size-4" />
								</Button>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Dialog.Root
	bind:open={createOpen}
	onOpenChange={(open) => {
		if (!open) resetCreate();
	}}
>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="text-lg">Create a slash command</Dialog.Title>
			<Dialog.Description>
				Slash commands appear in Discord when someone types
				<code class="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px]"
					>/</code
				>. Names must be lowercase and unique within this application.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="command-name">Command name</Label>
				<div class="relative">
					<span
						class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground"
						>/</span
					>
					<Input
						id="command-name"
						class="pl-6 font-mono"
						value={name}
						oninput={handleNameInput}
						placeholder="play"
						autocomplete="off"
					/>
				</div>
				<p class="text-xs text-muted-foreground">
					1-32 characters. Lowercase letters, numbers, hyphens and underscores.
				</p>
				{#if nameTaken && trimmedName.length > 0}
					<p class="text-xs text-red-400">
						A command named /{trimmedName} already exists.
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="command-description">Description</Label>
					<span
						class="text-xs {trimmedDescription.length > 100
							? 'text-red-400'
							: 'text-muted-foreground'}"
					>
						{description.length}/100
					</span>
				</div>
				<Textarea
					id="command-description"
					bind:value={description}
					rows={3}
					maxlength={100}
					placeholder="What does this command do?"
					class="min-h-24 resize-none"
				/>
			</div>

			<div class="rounded-xl border border-white/5 bg-black/20 p-3">
				<p
					class="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
				>
					Preview
				</p>
				<p class="mt-1.5 font-mono text-sm">
					<span class="text-blue-400">/</span><span
						>{trimmedName || "command-name"}</span
					>
				</p>
				<p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
					{trimmedDescription || "Your command description"}
				</p>
			</div>

			{#if formError}
				<p
					class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
				>
					{formError}
				</p>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (createOpen = false)}>
				Cancel
			</Button>
			<Button
				class="bg-blue-600 text-white hover:bg-blue-500"
				disabled={!canCreate}
				onclick={submitCommand}
			>
				{creating ? "Creating…" : "Create command"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	bind:open={deleteOpen}
	onOpenChange={(open) => {
		if (!open) {
			selectedCommand = null;
			deleteError = null;
		}
	}}
>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-lg">Delete slash command</Dialog.Title>
			<Dialog.Description>
				{selectedCommand
					? `This will permanently remove /${selectedCommand.name} from this workspace.`
					: "This command will be permanently removed."}
			</Dialog.Description>
		</Dialog.Header>

		{#if selectedCommand}
			<div class="rounded-xl border border-white/5 bg-black/20 p-3">
				<p class="font-mono text-sm">
					<span class="text-blue-400">/</span>{selectedCommand.name}
				</p>
				<p class="mt-1 text-xs text-muted-foreground">
					{selectedCommand.description}
				</p>
			</div>
		{/if}

		{#if deleteError}
			<p
				class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
			>
				{deleteError}
			</p>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteOpen = false)}>
				Keep command
			</Button>
			<Button
				variant="destructive"
				disabled={deleting}
				onclick={confirmDelete}
			>
				{deleting ? "Deleting…" : "Delete command"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if app && selectedOptionsCommand && optionsOpen}
	<CommandOptionsDialog
		{app}
		command={selectedOptionsCommand}
		bind:dialogOpen={optionsOpen}
		onSaved={() => void load(false)}
	/>
{/if}
