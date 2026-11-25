<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
import Search from "@lucide/svelte/icons/search";
import SquarePen from "@lucide/svelte/icons/square-pen";
import Zap from "@lucide/svelte/icons/zap";
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import BotPageHeader from "$lib/Components/Dashboard/BotPageHeader.svelte";
import EmptyState from "$lib/Components/Dashboard/EmptyState.svelte";
import ExportBotButton from "$lib/Components/Dashboard/ExportBotButton.svelte";
import { Button } from "$lib/Components/ui/button";
import Input from "$lib/Components/ui/input/input.svelte";
import { EVENT_META, GROUP_ICONS, GROUP_ORDER } from "$lib/Constants/EventMeta";
import {
	SUPPORTED_EVENTS,
	type SupportedEvent,
} from "$lib/Constants/SupportedEvents";

type EventFilter = "all" | "active" | "inactive";

const id = $derived(page.params.id ?? "");

let app = $state<Application | null>(null);
let activeEvents = $state<string[]>([]);
let configuredEvents = $state<string[]>([]);
let loading = $state(true);
let search = $state("");
let filter = $state<EventFilter>("all");
let pendingEvent = $state<string | null>(null);
let errorMessage = $state<string | null>(null);

const activeSet = $derived(new Set(activeEvents));
const configuredSet = $derived(new Set(configuredEvents));
const activeCount = $derived(
	SUPPORTED_EVENTS.filter((event) => activeSet.has(event.name)).length,
);
const intentCount = $derived(
	new Set(
		SUPPORTED_EVENTS.filter((event) =>
			activeSet.has(event.name),
		).flatMap((event) => event.intentsRequired ?? []),
	).size,
);

const filters = $derived([
	{ id: "all" as const, label: "All", count: SUPPORTED_EVENTS.length },
	{ id: "active" as const, label: "Active", count: activeCount },
	{
		id: "inactive" as const,
		label: "Inactive",
		count: SUPPORTED_EVENTS.length - activeCount,
	},
]);

const filteredSections = $derived.by(() => {
	const query = search.trim().toLowerCase();

	const visible = SUPPORTED_EVENTS.filter((event) => {
		const meta = EVENT_META[event.name];
		const haystack = [
			event.name,
			meta?.description ?? "",
			...(event.intentsRequired ?? []),
		]
			.join(" ")
			.toLowerCase();

		if (query && !haystack.includes(query)) return false;
		if (filter === "active" && !activeSet.has(event.name)) return false;
		if (filter === "inactive" && activeSet.has(event.name)) return false;

		return true;
	});

	return GROUP_ORDER.map((group) => ({
		group,
		icon: GROUP_ICONS[group],
		events: visible.filter(
			(event) => (EVENT_META[event.name]?.group ?? "Essentials") === group,
		),
	})).filter((section) => section.events.length > 0);
});

onMount(() => {
	void load();
});

async function load() {
	loading = true;

	try {
		if (!id) {
			app = null;
			activeEvents = [];
			return;
		}

		const found = await createSingleton().appManager.get(id);
		app = found ?? null;
		activeEvents = found ? [...found.schema.events] : [];
		configuredEvents = found ? [...found.schema.eventData.keys()] : [];
	} finally {
		loading = false;
	}
}

async function toggleEvent(event: SupportedEvent) {
	if (!app || pendingEvent) return;

	const wasActive = activeSet.has(event.name);
	const next = !wasActive;

	pendingEvent = event.name;
	errorMessage = null;

	activeEvents = next
		? [...activeEvents, event.name]
		: activeEvents.filter((name) => name !== event.name);

	try {
		await app.setEventEnabled(event.name, next);
	} catch (cause) {
		activeEvents = wasActive
			? [...activeEvents, event.name]
			: activeEvents.filter((name) => name !== event.name);

		errorMessage =
			cause instanceof Error
				? cause.message
				: "Something went wrong while updating this event.";
	} finally {
		pendingEvent = null;
	}
}

</script>

<svelte:head>
	<title>{app?.name ?? "Bot"} · Events</title>
</svelte:head>

<div class="min-h-full pb-16">
	<div
		class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8"
	>
		<BotPageHeader
			botName={app?.name ?? "Loading application"}
			avatar={app?.schema.avatar}
			title="Events"
			description="Choose which Discord events your bot listens to. Enabled events are saved with this application and can be wired into your bot's logic."
			meta={loading
				? []
				: [
						`${activeCount} active`,
						`${SUPPORTED_EVENTS.length} available`,
						`${intentCount} intents auto-managed`,
					]}
		>
			<ExportBotButton {app} />
		</BotPageHeader>

		{#if errorMessage}
			<div
				class="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
			>
				<AlertTriangle class="mt-0.5 size-4 shrink-0" />
				<span>{errorMessage}</span>
			</div>
		{/if}

		<div
			class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
		>
			<div
				class="flex w-fit flex-wrap items-center gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-1"
			>
				{#each filters as option (option.id)}
					<button
						type="button"
						onclick={() => (filter = option.id)}
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors {filter ===
						option.id
							? 'bg-white/10 text-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						{option.label}
						<span class="ml-1 text-[10px] text-muted-foreground"
							>{option.count}</span
						>
					</button>
				{/each}
			</div>

			<div class="relative w-full lg:max-w-xs">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					bind:value={search}
					placeholder="Search events or intents"
					class="h-10 pl-9"
				/>
			</div>
		</div>

		{#if loading}
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each [0, 1, 2, 3, 4, 5] as item (item)}
					<div
						class="h-48 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
					></div>
				{/each}
			</div>
		{:else if !app}
			<EmptyState
				icon={Zap}
				title="Application not found"
				description="This application does not exist in the local workspace. It may have been deleted."
			/>
		{:else if filteredSections.length === 0}
			<EmptyState
				icon={Search}
				title="No matching events"
				description="Try searching for a different event name or intent, or switch the filter back to all events."
			>
				<button
					type="button"
					class="rounded-md border border-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5"
					onclick={() => {
						search = "";
						filter = "all";
					}}
				>
					Reset filters
				</button>
			</EmptyState>
		{:else}
			{#each filteredSections as section (section.group)}
				<section class="space-y-3">
					<div class="flex items-center gap-2">
						<section.icon class="size-4 text-muted-foreground" />
						<h2 class="text-sm font-medium">{section.group}</h2>
						<span
							class="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
						>
							{section.events.length}
						</span>
						<div class="h-px flex-1 bg-white/5"></div>
					</div>

					<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{#each section.events as event (event.name)}
							{@const meta = EVENT_META[event.name]}
							{@const active = activeSet.has(event.name)}
							<article
								class="group flex flex-col gap-4 rounded-xl border p-5 transition-colors {active
									? 'border-blue-500/30 bg-blue-500/[0.045]'
									: 'border-white/5 bg-card/60 hover:border-white/10'}"
							>
								<div class="flex items-start justify-between gap-3">
									<div class="flex min-w-0 items-start gap-3">
										<div
											class="flex size-10 shrink-0 items-center justify-center rounded-lg border {active
												? 'border-blue-500/25 bg-blue-500/10 text-blue-400'
												: 'border-white/5 bg-white/[0.03] text-muted-foreground'}"
										>
											<section.icon class="size-4" />
										</div>
										<div class="min-w-0">
											<h3 class="truncate text-sm font-medium">
												{event.name}
											</h3>
											<p
												class="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
											>
												{meta?.description ??
													`Runs when Discord emits the ${event.name} event.`}
											</p>
										</div>
									</div>

									<button
										type="button"
										role="switch"
										aria-checked={active}
										aria-label={`${active ? "Disable" : "Enable"} ${event.name}`}
										disabled={pendingEvent !== null}
										onclick={() => void toggleEvent(event)}
										class="relative mt-0.5 h-6 w-10 shrink-0 rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60 {active
											? 'border-blue-500/40 bg-blue-500/80'
											: 'border-white/10 bg-white/[0.06]'}"
									>
										<span
											class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform {active
												? 'translate-x-5'
												: 'translate-x-0'}"
										></span>
									</button>
								</div>

								<div class="flex flex-wrap gap-1.5">
									{#each event.intentsRequired ?? [] as intent (intent)}
										<span
											class="rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
										>
											{intent}
										</span>
									{:else}
										<span
											class="rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
										>
											No intents required
										</span>
									{/each}
								</div>

								{#if event.warn}
									<div
										class="flex items-start gap-1.5 rounded-lg border border-amber-500/10 bg-amber-500/[0.06] px-2.5 py-2 text-[11px] leading-relaxed text-amber-200/70"
									>
										<AlertTriangle class="mt-0.5 size-3 shrink-0" />
										<span>{event.warn}</span>
									</div>
								{/if}

								<div
									class="mt-auto flex items-center justify-between border-t border-white/5 pt-3"
								>
									<span class="flex items-center gap-2">
										<span
											class="flex items-center gap-1.5 text-[11px] {active
												? 'text-emerald-400'
												: 'text-muted-foreground'}"
										>
											<span
												class="size-1.5 rounded-full {active
													? 'bg-emerald-400'
													: 'bg-muted-foreground/40'}"
											></span>
											{active ? "Enabled" : "Not enabled"}
										</span>
										{#if configuredSet.has(event.name)}
											<span
												class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-emerald-300 uppercase"
											>
												Graph
											</span>
										{/if}
									</span>
									<Button
										href={resolve("/[id]/editor/bot/events/[event]", {
											id,
											event: event.name,
										})}
										variant="ghost"
										size="sm"
										class="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
									>
										<SquarePen class="size-3.5" />
										Edit
									</Button>
								</div>
							</article>
						{/each}
					</div>
				</section>
			{/each}
		{/if}

		<div
			class="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-muted-foreground"
		>
			<span class="font-medium text-foreground">How events work.</span>
			Enabled events are saved to this application. Handler graphs live in the
			main editor, and gateway intents are collected automatically when code is
			generated.
		</div>
	</div>
</div>
