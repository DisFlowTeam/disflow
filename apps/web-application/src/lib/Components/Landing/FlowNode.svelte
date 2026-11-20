<script lang="ts">
import type { Component } from "svelte";

let {
	icon: Icon,
	title,
	subtitle,
	dotClass,
	iconClass,
}: {
	icon: Component;
	title: string;
	subtitle: string;
	dotClass: string;
	iconClass: string;
} = $props();
</script>

<div
	class="relative flex items-center gap-3 rounded-xl border border-white/10 bg-[#15171e] p-3 shadow-lg"
>
	<span
		class="absolute top-1/2 -left-[1.45rem] size-2.5 -translate-y-1/2 rounded-full border-2 border-[#15171e] {dotClass}"
	></span>
	<div
		class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] {iconClass}"
	>
		<Icon class="size-4" />
	</div>
	<div class="min-w-0">
		<p class="truncate text-xs font-medium">{title}</p>
		<p class="truncate text-[11px] text-muted-foreground">{subtitle}</p>
	</div>
</div>
