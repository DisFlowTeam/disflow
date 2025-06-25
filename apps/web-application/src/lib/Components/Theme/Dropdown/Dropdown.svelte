<script lang="ts">
	let state = $state({ isOpen: false });

	let { options, onSelect }: {
		options: string[],
		onSelect: (value: string) => void
	} = $props();

	function handleOption(option: string) {
		onSelect(option);
		state.isOpen = false;
	}
</script>

<div class="inline-block relative">
	<button
		onclick={() => (state.isOpen = !state.isOpen)}
		class="cursor-pointer select-none"
	>
		<slot />
	</button>
	{#if state.isOpen}
		<div
			class="dropdown  absolute left-0 mt-2 w-48 bg-slate-900 border border-gray-500 rounded-lg shadow-lg z-10"
			tabindex="0"
			role="menu"
			aria-label="Dropdown Menu"
		>
			<div class="py-2">
				{#each options as option}
					<button
						onclick={() => handleOption(option)}
						class="w-full text-left px-4 py-2 text-sm text-gray-300	hover:bg-gray-100 hover:text-black transition-colors"
					>
						{option}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
