<script lang="ts">
import AppSidebar from "$lib/Components/AppSidebar.svelte";
import * as Sidebar from "$lib/Components/ui/sidebar";

let { children } = $props();
</script>

<div class="h-full w-full overflow-hidden">
	<Sidebar.Provider class="h-full min-h-0">
		<AppSidebar />
		<div class="h-full min-w-0 flex-1 overflow-y-auto">
			{@render children?.()}
		</div>
	</Sidebar.Provider>
</div>
