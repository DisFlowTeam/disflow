<script lang="ts">
import type { Snippet } from "svelte";

let {
	botName,
	avatar,
	title,
	description,
	meta = [],
	children,
}: {
	botName: string;
	avatar?: string;
	title: string;
	description: string;
	meta?: string[];
	children?: Snippet;
} = $props();
</script>

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
			<div class="relative shrink-0">
				<img
					src={avatar || "/DISFLOW_ICO.png"}
					alt=""
					class="size-14 rounded-full border border-white/10 bg-neutral-900 object-cover lg:size-16"
				/>
				<span
					class="absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-2 border-card bg-emerald-400"
				></span>
			</div>
			<div class="min-w-0">
				<div
					class="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
				>
					<span class="max-w-48 truncate">{botName}</span>
					<span class="size-1 rounded-full bg-muted-foreground/40"></span>
					<span>Discord application</span>
				</div>
				<h1 class="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">
					{title}
				</h1>
				<p class="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
				{#if meta.length > 0}
					<div class="mt-4 flex flex-wrap gap-2">
						{#each meta as item (item)}
							<span
								class="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-muted-foreground"
							>
								{item}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		{#if children}
			<div class="flex shrink-0 flex-wrap items-center gap-2">
				{@render children()}
			</div>
		{/if}
	</div>
</header>
