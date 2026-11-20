<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import Bot from "@lucide/svelte/icons/bot";
import LayoutGrid from "@lucide/svelte/icons/layout-grid";
import Search from "@lucide/svelte/icons/search";
import ShieldCheck from "@lucide/svelte/icons/shield-check";
import { onMount } from "svelte";
import BotCard from "$lib/Components/BotCard.svelte";
import CreateBot from "$lib/Components/Buttons/CreateBot.svelte";
import EmptyState from "$lib/Components/Dashboard/EmptyState.svelte";
import { Button } from "$lib/Components/ui/button";
import Input from "$lib/Components/ui/input/input.svelte";

let apps = $state<Application[]>([]);
let loading = $state(true);
let errorMessage = $state<string | null>(null);
let search = $state("");

const totalCommands = $derived(
	apps.reduce((total, app) => total + app.schema.commands.size, 0),
);
const totalEvents = $derived(
	apps.reduce((total, app) => total + app.schema.events.length, 0),
);

const filteredApps = $derived.by(() => {
	const query = search.trim().toLowerCase();

	if (!query) return apps;

	return apps.filter((app) =>
		`${app.name} ${app.id}`.toLowerCase().includes(query),
	);
});

onMount(() => {
	void refreshItems();
});

async function refreshItems() {
	loading = true;
	errorMessage = null;

	try {
		const found = await createSingleton().appManager.getAll();

		apps = found.sort(
			(a, b) =>
				new Date(b.schema.lastModified).getTime() -
				new Date(a.schema.lastModified).getTime(),
		);
	} catch (cause) {
		errorMessage =
			cause instanceof Error
				? cause.message
				: "Unable to load your applications.";
	} finally {
		loading = false;
	}
}
</script>

<svelte:head>
	<title>DisFlow · Your bots</title>
</svelte:head>

<div class="h-full overflow-y-auto">
	<div
		class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pb-16 sm:p-6 lg:p-8"
	>
		<header
			class="relative overflow-hidden rounded-2xl border border-white/5 bg-card/70 p-6 shadow-sm lg:p-8"
		>
			<div
				class="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),transparent_48%)]"
			></div>

			<div
				class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
			>
				<div class="flex min-w-0 items-start gap-4">
					<div
						class="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400 lg:size-16"
					>
						<LayoutGrid class="size-6" />
					</div>

					<div class="min-w-0">
						<div
							class="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
						>
							<span>DisFlow workspace</span>
							<span class="size-1 rounded-full bg-muted-foreground/40"></span>
							<span>Local-first</span>
						</div>
						<h1 class="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">
							Your bots
						</h1>
						<p class="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
							Create, manage and open your Discord applications. Everything stays
							on this device.
						</p>
						<div class="mt-4 flex flex-wrap gap-2">
							<span
								class="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-muted-foreground"
							>
								{loading ? "Loading…" : `${apps.length} ${apps.length === 1 ? "bot" : "bots"}`}
							</span>
							<span
								class="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-muted-foreground"
							>
								{totalCommands} commands
							</span>
							<span
								class="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-muted-foreground"
							>
								{totalEvents} events
							</span>
						</div>
					</div>
				</div>

				<div class="flex shrink-0 items-center gap-2">
					<CreateBot refresh={refreshItems} />
				</div>
			</div>
		</header>

		{#if errorMessage}
			<div
				class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
			>
				{errorMessage}
			</div>
		{/if}

		<div
			class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="relative w-full sm:max-w-xs">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					bind:value={search}
					placeholder="Search bots"
					class="h-10 pl-9"
				/>
			</div>
			<p class="text-xs text-muted-foreground">
				Showing <span class="font-medium text-foreground"
					>{filteredApps.length}</span
				> of {apps.length}
			</p>
		</div>

		{#if loading}
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each [0, 1, 2] as item (item)}
					<div
						class="h-56 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
					></div>
				{/each}
			</div>
		{:else if apps.length === 0}
			<EmptyState
				icon={Bot}
				title="No bots yet"
				description="Create your first DisFlow project by connecting a Discord bot token. It stays encrypted on this device."
			>
				<CreateBot refresh={refreshItems} />
			</EmptyState>
		{:else if filteredApps.length === 0}
			<EmptyState
				icon={Search}
				title="No matching bots"
				description="Try a different name or application ID, or clear the search to see every bot."
			>
				<Button variant="outline" onclick={() => (search = "")}>
					Clear search
				</Button>
			</EmptyState>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each filteredApps as bot (bot.id)}
					<BotCard {bot} />
				{/each}
			</div>
		{/if}

		<div
			class="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-muted-foreground"
		>
			<ShieldCheck class="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
			<span>
				DisFlow is local-first. Your bot data, tokens and environment variables
				stay encrypted on this device.
			</span>
		</div>
	</div>
</div>
