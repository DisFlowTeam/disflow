<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
import Bot from "@lucide/svelte/icons/bot";
import Check from "@lucide/svelte/icons/check";
import Circle from "@lucide/svelte/icons/circle";
import Clock from "@lucide/svelte/icons/clock";
import Code from "@lucide/svelte/icons/code";
import Command from "@lucide/svelte/icons/command";
import Copy from "@lucide/svelte/icons/copy";
import Database from "@lucide/svelte/icons/database";
import KeyRound from "@lucide/svelte/icons/key-round";
import Rocket from "@lucide/svelte/icons/rocket";
import ShieldCheck from "@lucide/svelte/icons/shield-check";
import Zap from "@lucide/svelte/icons/zap";
import { type Component, onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import BotPageHeader from "$lib/Components/Dashboard/BotPageHeader.svelte";
import EmptyState from "$lib/Components/Dashboard/EmptyState.svelte";
import ExportBotButton from "$lib/Components/Dashboard/ExportBotButton.svelte";
import { Button } from "$lib/Components/ui/button";

const id = $derived(page.params.id ?? "");

let app = $state<Application | null>(null);
let loading = $state(true);
let errorMessage = $state<string | null>(null);
let lastModifiedText = $state("—");
let copiedId = $state(false);

const commandCount = $derived(app?.schema.commands.size ?? 0);
const eventCount = $derived(app?.schema.events.length ?? 0);
const configuredEventCount = $derived(app?.schema.eventData.size ?? 0);
const variableCount = $derived(app?.schema.environment.variables.size ?? 0);

type Stat = {
	label: string;
	value: number;
	hint: string;
	href: string;
	icon: Component;
	accent: string;
};

const stats = $derived<Stat[]>([
	{
		label: "Slash commands",
		value: commandCount,
		hint: "Slash commands only",
		href: resolve("/[id]/editor/bot/commands", { id }),
		icon: Command,
		accent: "border-blue-500/20 bg-blue-500/10 text-blue-400",
	},
	{
		label: "Events",
		value: eventCount,
		hint: `${configuredEventCount} handler ${configuredEventCount === 1 ? "graph" : "graphs"}`,
		href: resolve("/[id]/editor/bot/events", { id }),
		icon: Zap,
		accent: "border-red-500/20 bg-red-500/10 text-red-400",
	},
	{
		label: "Environment",
		value: variableCount,
		hint: "Encrypted at rest",
		href: resolve("/[id]/editor/bot/variables", { id }),
		icon: KeyRound,
		accent: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
	},
]);

const checklist = $derived([
	{
		label: "Create a slash command",
		description: "Give users a / command they can run.",
		done: commandCount > 0,
		href: resolve("/[id]/editor/bot/commands", { id }),
	},
	{
		label: "Create an event handler",
		description: "React to messages, members, reactions and more.",
		done: configuredEventCount > 0,
		href: resolve("/[id]/editor/bot/events", { id }),
	},
	{
		label: "Add an environment variable",
		description: "Store tokens and secrets encrypted at rest.",
		done: variableCount > 0,
		href: resolve("/[id]/editor/bot/variables", { id }),
	},
]);

const completedSteps = $derived(
	checklist.filter((item) => item.done).length,
);
const progress = $derived(
	Math.round((completedSteps / checklist.length) * 100),
);

onMount(() => {
	void load();
});

async function load() {
	loading = true;
	errorMessage = null;

	try {
		if (!id) return;

		const found = await createSingleton().appManager.get(id);
		app = found ?? null;

		if (found) {
			lastModifiedText = new Intl.DateTimeFormat(undefined, {
				dateStyle: "medium",
				timeStyle: "short",
			}).format(found.schema.lastModified);
		}
	} catch (cause) {
		errorMessage =
			cause instanceof Error
				? cause.message
				: "Unable to load this application.";
	} finally {
		loading = false;
	}
}

async function copyId() {
	if (!app) return;

	try {
		await navigator.clipboard.writeText(app.id);
		copiedId = true;
		setTimeout(() => (copiedId = false), 1500);
	} catch {
		// Clipboard access can be denied; the ID is still visible.
	}
}
</script>

<svelte:head>
	<title>{app?.name ?? "Bot"} · Overview</title>
</svelte:head>

<div class="min-h-full pb-16">
	<div
		class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8"
	>
		<BotPageHeader
			botName={app?.name ?? "Loading application"}
			avatar={app?.schema.avatar}
			title="Overview"
			description="A quick look at your bot's commands, event handlers and local environment."
			meta={loading
				? []
				: [
						`${commandCount} commands`,
						`${eventCount} events`,
						`${variableCount} variables`,
					]}
		>
			<Button
				variant="outline"
				size="sm"
				href={resolve("/[id]/editor/bot/main", { id })}
			>
				<Code class="size-4" />
				Open editor
			</Button>
			<ExportBotButton {app} />
		</BotPageHeader>

		{#if errorMessage}
			<div
				class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
			>
				{errorMessage}
			</div>
		{/if}

		{#if loading}
			<div class="grid gap-4 sm:grid-cols-3">
				{#each [0, 1, 2] as item (item)}
					<div
						class="h-36 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
					></div>
				{/each}
			</div>
			<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<div
					class="h-64 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
				></div>
				<div
					class="h-64 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
				></div>
			</div>
		{:else if !app}
			<EmptyState
				icon={Bot}
				title="Application not found"
				description="This application does not exist in the local workspace. It may have been deleted."
			>
				<Button href={resolve("/bots")}>Back to bots</Button>
			</EmptyState>
		{:else}
			<div class="grid gap-4 sm:grid-cols-3">
				{#each stats as stat (stat.label)}
					<a
						href={stat.href}
						class="group rounded-xl border border-white/5 bg-card/60 p-5 transition-colors hover:border-blue-500/30 hover:bg-card"
					>
						<div class="flex items-center justify-between">
							<span
								class="flex size-9 items-center justify-center rounded-lg border {stat.accent}"
							>
								<stat.icon class="size-4" />
							</span>
							<ArrowUpRight
								class="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
							/>
						</div>
						<p class="mt-4 text-2xl font-semibold tracking-tight">
							{stat.value}
						</p>
						<p
							class="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase"
						>
							{stat.label}
						</p>
						<p class="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
					</a>
				{/each}
			</div>

			<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<section
					class="rounded-xl border border-white/5 bg-card/40 p-5"
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<div class="flex items-center gap-2">
								<Rocket class="size-4 text-blue-400" />
								<h2 class="text-sm font-medium">Getting started</h2>
							</div>
							<p class="mt-1 text-xs text-muted-foreground">
								Set up the essentials for your bot.
							</p>
						</div>
						<span
							class="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
						>
							{completedSteps}/{checklist.length}
						</span>
					</div>

					<div class="mt-4 space-y-1">
						{#each checklist as item (item.label)}
							<a
								href={item.href}
								class="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
							>
								<span
									class="flex size-6 shrink-0 items-center justify-center rounded-full border {item.done
										? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
										: 'border-white/10 bg-white/[0.03] text-muted-foreground'}"
								>
									{#if item.done}
										<Check class="size-3.5" />
									{:else}
										<Circle class="size-3.5" />
									{/if}
								</span>
								<span class="min-w-0 flex-1">
									<span class="block text-sm">{item.label}</span>
									<span class="block text-xs text-muted-foreground"
										>{item.description}</span
									>
								</span>
								<ArrowUpRight
									class="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
								/>
							</a>
						{/each}
					</div>

					<div class="mt-4">
						<div class="h-1.5 overflow-hidden rounded-full bg-white/5">
							<div
								class="h-full rounded-full bg-blue-500 transition-[width]"
								style={`width: ${progress}%`}
							></div>
						</div>
						<p class="mt-2 text-xs text-muted-foreground">
							{#if completedSteps === checklist.length}
								Everything is set up. Export your bot when you are ready.
							{:else}
								{checklist.length - completedSteps} step{checklist.length -
								completedSteps ===
								1
									? ""
									: "s"} remaining.
							{/if}
						</p>
					</div>
				</section>

				<section
					class="rounded-xl border border-white/5 bg-card/40 p-5"
				>
					<div class="flex items-center gap-2">
						<ShieldCheck class="size-4 text-emerald-400" />
						<h2 class="text-sm font-medium">Bot details</h2>
					</div>

					<dl class="mt-4 space-y-4 text-sm">
						<div class="flex items-start justify-between gap-4">
							<dt class="text-muted-foreground">Application ID</dt>
							<dd class="flex min-w-0 items-center gap-2">
								<span class="truncate font-mono text-xs">{app.id}</span>
								<button
									type="button"
									class="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
									title="Copy application ID"
									aria-label="Copy application ID"
									onclick={copyId}
								>
									{#if copiedId}
										<Check class="size-3.5 text-emerald-400" />
									{:else}
										<Copy class="size-3.5" />
									{/if}
								</button>
							</dd>
						</div>

						<div class="flex items-center justify-between gap-4">
							<dt class="text-muted-foreground">Storage</dt>
							<dd class="flex items-center gap-1.5 text-xs">
								<Database class="size-3.5 text-muted-foreground" />
								Local IndexedDB
							</dd>
						</div>

						<div class="flex items-center justify-between gap-4">
							<dt class="text-muted-foreground">Bot token</dt>
							<dd>
								<span
									class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-emerald-300 uppercase"
								>
									Encrypted
								</span>
							</dd>
						</div>

						<div class="flex items-center justify-between gap-4">
							<dt class="flex items-center gap-1.5 text-muted-foreground">
								<Clock class="size-3.5" />
								Last modified
							</dt>
							<dd class="text-right text-xs">{lastModifiedText}</dd>
						</div>
					</dl>

					<div
						class="mt-5 flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground"
					>
						<ShieldCheck class="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
						<span>
							DisFlow is local-first. Your bot token and environment values stay
							encrypted on this device.
						</span>
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>
