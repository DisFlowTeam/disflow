<script lang="ts">
    import { Button } from "$lib/Components/ui/button";
    import Code from "@lucide/svelte/icons/chevrons-left-right-ellipsis";
    import Rocket from "@lucide/svelte/icons/rocket";
    import Bot from "@lucide/svelte/icons/bot";

	let items = $state([]);
</script>

<div class="w-full h-full">
	<div class="h-1/12 w-full pl-3 flex items-center">
        <Button variant="outline">New</Button>
    </div>
	<div class="h-11/12 w-full">
		{#if items.length === 0}
            <!-- No record Component -->
			<div class="h-full w-full flex items-center justify-center">
                <div class="select-none cursor-default">
                    <img src="/DISFLOW_ICO.png" class="grayscale transition-all hover:opacity-100 rounded-lg opacity-30 h-56 w-56" alt="Disflow icon">
                    <p class="text-center mt-3 transition-all hover:text-neutral-300 text-4xl font-serif text-neutral-600">No Bots found</p>
                    <hr class="mt-1">
                    <p class="text-center mt-1 transition-all hover:text-neutral-300 text-neutral-500">Click on "New" to create one!</p>
                    <div class="flex gap-2 items-center mt-3 justify-between w-4/6 mx-auto text-neutral-600">
                        <Bot class="transition-all hover:text-neutral-300" />
                        <Code class="transition-all hover:text-neutral-300" />
                        <Rocket class="transition-all hover:text-neutral-300" />
                    </div>
                </div>
            </div>
		{/if}
	</div>
</div>
