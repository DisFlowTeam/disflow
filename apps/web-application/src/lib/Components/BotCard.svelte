<script lang="ts">
import type { Application } from "@disflow-team/local-data";
import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
import Clock from "@lucide/svelte/icons/clock";
import Command from "@lucide/svelte/icons/command";
import KeyRound from "@lucide/svelte/icons/key-round";
import Zap from "@lucide/svelte/icons/zap";
import { resolve } from "$app/paths";

let { bot }: { bot: Application } = $props();

const commandCount = $derived(bot.schema.commands.size);
const eventCount = $derived(bot.schema.events.length);
const variableCount = $derived(bot.schema.environment.variables.size);
const lastModified = $derived(
	bot.schema.lastModified.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}),
);
const description = $derived(
	bot.schema.description?.trim() || "A DisFlow Discord application.",
);
</script>

<a
	href={resolve("/[id]/editor", { id: bot.id })}
	class="group flex h-full flex-col rounded-xl border border-white/5 bg-card/60 p-5 transition-colors hover:border-blue-500/30 hover:bg-card"
>
	<div class="flex items-start justify-between gap-3">
		<div class="flex min-w-0 items-center gap-3">
			<div class="relative shrink-0">
				<img
					src={bot.schema.avatar || "/DISFLOW_ICO.png"}
					alt=""
					class="size-11 rounded-full border border-white/10 bg-neutral-900 object-cover"
				/>
				<span
					class="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-card bg-emerald-400"
				></span>
			</div>
			<div class="min-w-0">
				<h2 class="truncate text-sm font-medium">{bot.name}</h2>
				<p class="truncate font-mono text-[10px] text-muted-foreground">
					{bot.id}
				</p>
			</div>
		</div>
		<ArrowUpRight
			class="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
		/>
	</div>

	<p class="mt-4 line-clamp-2 min-h-8 text-xs leading-relaxed text-muted-foreground">
		{description}
	</p>

	<div class="mt-4 grid grid-cols-3 gap-2">
		<div class="rounded-lg border border-white/5 bg-white/[0.02] p-2">
			<div class="flex items-center gap-1 text-muted-foreground">
				<Command class="size-3" />
				<span class="text-[9px] font-medium tracking-wide uppercase"
					>Commands</span
				>
			</div>
			<p class="mt-1 text-sm font-semibold">{commandCount}</p>
		</div>
		<div class="rounded-lg border border-white/5 bg-white/[0.02] p-2">
			<div class="flex items-center gap-1 text-muted-foreground">
				<Zap class="size-3" />
				<span class="text-[9px] font-medium tracking-wide uppercase"
					>Events</span
				>
			</div>
			<p class="mt-1 text-sm font-semibold">{eventCount}</p>
		</div>
		<div class="rounded-lg border border-white/5 bg-white/[0.02] p-2">
			<div class="flex items-center gap-1 text-muted-foreground">
				<KeyRound class="size-3" />
				<span class="text-[9px] font-medium tracking-wide uppercase"
					>Secrets</span
				>
			</div>
			<p class="mt-1 text-sm font-semibold">{variableCount}</p>
		</div>
	</div>

	<div
		class="mt-auto flex items-center justify-between border-t border-white/5 pt-3"
	>
		<span class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
			<Clock class="size-3" />
			{lastModified}
		</span>
		<span
			class="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium tracking-wide text-muted-foreground uppercase"
		>
			Local
		</span>
	</div>
</a>
