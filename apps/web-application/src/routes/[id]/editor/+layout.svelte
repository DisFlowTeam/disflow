<script lang="ts">
	import AppSidebar from '$lib/Components/AppSidebar.svelte';
	import * as Sidebar from '$lib/Components/ui/sidebar';

	let { children } = $props();
</script>

<div class="h-full w-full overflow-hidden">
	<Sidebar.Provider>
		<AppSidebar />
		<div>
			{@render children?.()}
		</div>
	</Sidebar.Provider>
</div>
