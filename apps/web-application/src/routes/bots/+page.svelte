<script lang="ts">
import { createSingleton } from "@disflow-team/local-data";
import Bot from "@lucide/svelte/icons/bot";
import Code from "@lucide/svelte/icons/chevrons-left-right-ellipsis";
import Rocket from "@lucide/svelte/icons/rocket";
import { type ComponentProps, onMount } from "svelte";
import type BotCard from "$lib/Components/BotCard.svelte";
import CreateBot from "$lib/Components/Buttons/CreateBot.svelte";

let items: ComponentProps<typeof BotCard>[] = $state([]);

async function refreshItems() {
	const db = createSingleton();
	items = (await db.appManager.getAll()).map((v) => ({
		avatar: v.schema.avatar || "./DISFLOW_ICO.png",
		id: v.id,
		username: v.name,
		lastModified: v.schema.lastModified,
		description: "A DisFlow bot",
	}));
}

onMount(() => {
	void refreshItems();
});
</script>

<div class="w-full h-full">
    <CreateBot refresh={refreshItems} />
	<div class="h-11/12 w-full">
		{#if items.length === 0}
			<div class="h-full w-full flex items-center justify-center">
				<div class="select-none cursor-default">
					<img
						src="/DISFLOW_ICO.png"
						class="grayscale transition-all hover:opacity-100 rounded-lg opacity-30 h-56 w-56"
						alt="Disflow icon"
					/>
					<p
						class="text-center mt-3 transition-all hover:text-neutral-300 text-4xl font-serif text-neutral-600"
					>
						No Bots found
					</p>
					<hr class="mt-1" />
					<p class="text-center mt-1 transition-all hover:text-neutral-300 text-neutral-500">
						Click on "New" to create one!
					</p>
					<div class="flex gap-2 items-center mt-3 justify-between w-4/6 mx-auto text-neutral-600">
						<Bot class="transition-all hover:text-neutral-300" />
						<Code class="transition-all hover:text-neutral-300" />
						<Rocket class="transition-all hover:text-neutral-300" />
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-wrap px-5 gap-4 h-full w-full">
				{#each items as bot, i (i)}
					<BotCard {...bot} />
				{/each}
			</div>
		{/if}
	</div>
</div>
