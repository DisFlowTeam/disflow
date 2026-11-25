<script lang="ts">
import type { Component, Snippet } from "svelte";

let {
	icon: Icon,
	title,
	description,
	children,
}: {
	icon: Component;
	title: string;
	description: string;
	children?: Snippet;
} = $props();
</script>

<div
	class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center"
>
	<div
		class="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-blue-400"
	>
		<Icon class="size-6" />
	</div>
	<h2 class="mt-4 text-base font-medium">{title}</h2>
	<p class="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
		{description}
	</p>
	{#if children}
		<div class="mt-5">{@render children()}</div>
	{/if}
</div>
