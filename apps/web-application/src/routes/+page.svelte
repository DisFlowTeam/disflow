<script lang="ts">
import ArrowRight from "@lucide/svelte/icons/arrow-right";
import Check from "@lucide/svelte/icons/check";
import Command from "@lucide/svelte/icons/command";
import Database from "@lucide/svelte/icons/database";
import Download from "@lucide/svelte/icons/download";
import ExternalLink from "@lucide/svelte/icons/external-link";
import MessageSquare from "@lucide/svelte/icons/message-square";
import Package from "@lucide/svelte/icons/package";
import ShieldCheck from "@lucide/svelte/icons/shield-check";
import Sparkles from "@lucide/svelte/icons/sparkles";
import Terminal from "@lucide/svelte/icons/terminal";
import Workflow from "@lucide/svelte/icons/workflow";
import Zap from "@lucide/svelte/icons/zap";
import type { Component } from "svelte";
import { resolve } from "$app/paths";
import FlowNode from "$lib/Components/Landing/FlowNode.svelte";
import { Button } from "$lib/Components/ui/button";

type Feature = {
	icon: Component;
	title: string;
	description: string;
};

const features: Feature[] = [
	{
		icon: Workflow,
		title: "Visual node editor",
		description:
			"Design your bot's logic on an infinite canvas. Connect events, conditions, actions and data without writing boilerplate.",
	},
	{
		icon: Command,
		title: "Slash commands",
		description:
			"Create slash commands with friendly option types, choices, ranges and autocomplete.",
	},
	{
		icon: Zap,
		title: "Event handlers",
		description:
			"React to messages, members, reactions, presence, voice and more with event-specific nodes.",
	},
	{
		icon: ShieldCheck,
		title: "Encrypted secrets",
		description:
			"Store bot tokens and environment variables locally, encrypted behind your passcode.",
	},
	{
		icon: Package,
		title: "One-click export",
		description:
			"Download a ready-to-run Discord.js project with commands, events, package.json and env setup.",
	},
	{
		icon: Database,
		title: "Local-first",
		description:
			"Your bot data lives in your browser. No accounts, no cloud dependency, no telemetry.",
	},
];

const steps: Feature[] = [
	{
		icon: Terminal,
		title: "Create your bot",
		description:
			"Connect your Discord bot token. It is encrypted with your passcode and stored locally.",
	},
	{
		icon: Workflow,
		title: "Build the logic",
		description:
			"Add slash commands and event handlers using the visual editor, then save each handler.",
	},
	{
		icon: Download,
		title: "Export and run",
		description:
			"Download the ZIP, install dependencies, add your token to .env and start the bot.",
	},
];
</script>

<svelte:head>
	<title>DisFlow · Visual Discord bot builder</title>
	<meta
		name="description"
		content="DisFlow is a local-first visual builder for Discord bots. Design slash commands and event handlers, then export a ready-to-run Discord.js project."
	/>
</svelte:head>

<div class="h-full overflow-y-auto">
	<div class="relative min-h-full bg-background">
		<div
			class="pointer-events-none absolute top-0 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
		></div>

		<main class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<section
				class="grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24"
			>
				<div class="relative z-10">
					<div
						class="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
					>
						<Sparkles class="size-3.5" />
						Visual Discord bot builder
					</div>

					<h1
						class="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
					>
						Build Discord bots
						<span class="text-blue-400">without the boilerplate.</span>
					</h1>

					<p
						class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
					>
						DisFlow turns a node graph into a ready-to-run Discord.js bot.
						Design slash commands, wire up events, store secrets safely and
						export a ZIP.
					</p>

					<div class="mt-8 flex flex-wrap gap-3">
						<Button
							href={resolve("/bots")}
							class="h-11 gap-2 bg-blue-600 px-5 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
						>
							Open workspace
							<ArrowRight class="size-4" />
						</Button>
						<Button
							href="https://github.com/DisFlowTeam/disflow"
							target="_blank"
							rel="noreferrer"
							variant="outline"
							class="h-11 gap-2 px-5"
						>
							<ExternalLink class="size-4" />
							View source
						</Button>
					</div>

					<div
						class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
					>
						<span class="flex items-center gap-1.5">
							<Check class="size-3.5 text-emerald-400" />
							Local-first
						</span>
						<span class="flex items-center gap-1.5">
							<Check class="size-3.5 text-emerald-400" />
							Encrypted secrets
						</span>
						<span class="flex items-center gap-1.5">
							<Check class="size-3.5 text-emerald-400" />
							Discord.js 14
						</span>
					</div>
				</div>

				<div class="relative">
					<div
						class="absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-3xl"
					></div>

					<div
						class="relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 shadow-2xl"
					>
						<div
							class="flex items-center justify-between border-b border-white/5 px-4 py-3"
						>
							<div class="flex items-center gap-1.5">
								<span class="size-2 rounded-full bg-red-400/70"></span>
								<span class="size-2 rounded-full bg-amber-400/70"></span>
								<span class="size-2 rounded-full bg-emerald-400/70"></span>
							</div>
							<span
								class="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
							>
								Message handler
							</span>
							<span
								class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
							>
								Live
							</span>
						</div>

						<div class="p-5 sm:p-6">
							<div class="relative pl-9">
								<div
									class="absolute top-8 bottom-8 left-[1.15rem] w-px bg-white/10"
								></div>

								<div class="space-y-3">
									<FlowNode
										icon={MessageSquare}
										title="On Message"
										subtitle="messageCreate"
										dotClass="bg-red-400"
										iconClass="text-red-400"
									/>
									<FlowNode
										icon={Terminal}
										title="Get Message Content"
										subtitle="text output"
										dotClass="bg-violet-400"
										iconClass="text-violet-400"
									/>
									<FlowNode
										icon={Workflow}
										title="If"
										subtitle="contains “hello”"
										dotClass="bg-blue-400"
										iconClass="text-blue-400"
									/>
									<FlowNode
										icon={ArrowRight}
										title="Reply To Message"
										subtitle="send a reply"
										dotClass="bg-amber-400"
										iconClass="text-amber-400"
									/>
								</div>
							</div>
						</div>
					</div>

					<div
						class="absolute -right-3 -bottom-4 flex items-center gap-2 rounded-xl border border-white/10 bg-card px-3 py-2 shadow-xl"
					>
						<Package class="size-4 text-blue-400" />
						<span class="text-xs font-medium">Export ready</span>
						<span class="font-mono text-[10px] text-muted-foreground">.zip</span>
					</div>
				</div>
			</section>

			<section class="border-t border-white/5 py-16">
				<div class="max-w-2xl">
					<p
						class="text-xs font-medium tracking-[0.18em] text-blue-400 uppercase"
					>
						Everything included
					</p>
					<h2 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
						Everything you need to ship.
					</h2>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
						From the first node to a runnable project, DisFlow keeps the
						workflow visual and your secrets local.
					</p>
				</div>

				<div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each features as feature (feature.title)}
						<div
							class="group rounded-xl border border-white/5 bg-card/40 p-5 transition-colors hover:border-blue-500/30 hover:bg-card/70"
						>
							<div
								class="flex size-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400"
							>
								<feature.icon class="size-4" />
							</div>
							<h3 class="mt-4 text-sm font-medium">{feature.title}</h3>
							<p class="mt-1.5 text-xs leading-relaxed text-muted-foreground">
								{feature.description}
							</p>
						</div>
					{/each}
				</div>
			</section>

			<section class="border-t border-white/5 py-16">
				<div class="max-w-2xl">
					<p
						class="text-xs font-medium tracking-[0.18em] text-blue-400 uppercase"
					>
						How it works
					</p>
					<h2 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
						From graph to ZIP.
					</h2>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
						Three steps between an idea and a bot running in your server.
					</p>
				</div>

				<div class="mt-8 grid gap-4 lg:grid-cols-3">
					{#each steps as step, index (step.title)}
						<div
							class="relative rounded-xl border border-white/5 bg-card/40 p-5"
						>
							<span class="font-mono text-[10px] text-blue-400"
								>0{index + 1}</span
							>
							<div
								class="mt-3 flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground"
							>
								<step.icon class="size-4" />
							</div>
							<h3 class="mt-4 text-sm font-medium">{step.title}</h3>
							<p class="mt-1.5 text-xs leading-relaxed text-muted-foreground">
								{step.description}
							</p>
						</div>
					{/each}
				</div>
			</section>

			<section class="py-16">
				<div
					class="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 via-card to-card px-6 py-12 text-center sm:px-12"
				>
					<div
						class="pointer-events-none absolute top-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl"
					></div>
					<div class="relative">
						<h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
							Ready to build your next bot?
						</h2>
						<p
							class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground"
						>
							Start with a token, build your handlers visually and export a
							project you can run anywhere Node.js runs.
						</p>
						<div class="mt-7 flex flex-wrap justify-center gap-3">
							<Button
								href={resolve("/bots")}
								class="h-11 gap-2 bg-blue-600 px-5 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
							>
								Open workspace
								<ArrowRight class="size-4" />
							</Button>
							<Button
								href="https://github.com/DisFlowTeam/disflow"
								target="_blank"
								rel="noreferrer"
								variant="outline"
								class="h-11 gap-2 px-5"
							>
								<ExternalLink class="size-4" />
								View source
							</Button>
						</div>
						<p class="mt-4 text-[11px] text-muted-foreground">
							No account required. Your data stays on this device.
						</p>
					</div>
				</div>
			</section>
		</main>

		<footer class="border-t border-white/5">
			<div
				class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
			>
				<div class="flex items-center gap-3">
					<img
						src="/DISFLOW_ICO.png"
						alt="DisFlow"
						class="size-8 rounded-md object-contain"
					/>
					<div>
						<p class="text-sm font-medium">
							DIS<span class="text-blue-400">FLOW</span>
						</p>
						<p class="text-[11px] text-muted-foreground">
							Graph, flow, ship. Built for Discord.
						</p>
					</div>
				</div>

				<div class="flex items-center gap-4 text-xs text-muted-foreground">
					<a
						href={resolve("/bots")}
						class="transition-colors hover:text-foreground">Workspace</a
					>
					<a
						href="https://github.com/DisFlowTeam/disflow"
						target="_blank"
						rel="noreferrer"
						class="transition-colors hover:text-foreground">GitHub</a
					>
					<span>Local-first</span>
				</div>
			</div>
		</footer>
	</div>
</div>
