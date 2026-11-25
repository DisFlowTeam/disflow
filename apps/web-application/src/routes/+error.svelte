<script lang="ts">
import ArrowRight from "@lucide/svelte/icons/arrow-right";
import House from "@lucide/svelte/icons/house";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { Button } from "$lib/Components/ui/button";

const notFound = $derived(page.status === 404);
const title = $derived(notFound ? "Page not found" : "Something went wrong");
</script>

<svelte:head>
	<title>{title} · DisFlow</title>
</svelte:head>

<div class="relative flex h-full items-center justify-center overflow-hidden px-6">
	<div
		class="pointer-events-none absolute top-0 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
	></div>

	<div class="relative flex max-w-md flex-col items-center text-center">
		<p
			class="font-mono text-5xl font-semibold tracking-[0.2em] text-blue-400 uppercase sm:text-6xl"
		>
			{notFound ? "404" : page.status}
		</p>

		<h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
			{title}
		</h1>

		<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
			{#if notFound}
				The page you are looking for does not exist or has moved.
			{:else}
				{page.error?.message ?? "An unexpected error occurred."}
			{/if}
		</p>

		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<Button
				href={resolve("/bots")}
				class="h-11 gap-2 bg-blue-600 px-5 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
			>
				Go to workspace
				<ArrowRight class="size-4" />
			</Button>
			<Button href={resolve("/")} variant="outline" class="h-11 gap-2 px-5">
				<House class="size-4" />
				Back home
			</Button>
		</div>
	</div>
</div>
