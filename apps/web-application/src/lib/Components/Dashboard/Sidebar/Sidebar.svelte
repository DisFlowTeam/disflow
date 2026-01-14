<script lang="ts">
	import Rows4 from '@lucide/svelte/icons/rows-4';
	import User from '@lucide/svelte/icons/user';
    import Info from "@lucide/svelte/icons/info";
    import SquareTerminal from "@lucide/svelte/icons/square-terminal";
	import SidebarTab from './SidebarTab.svelte';

	import { page } from '$app/state';
</script>

<div class="h-full w-1/5 p-3">
	<div class="w-full h-full rounded-sm pt-3 border-white/5 border-2">
		{#if page.params.id}
            <SidebarTab Icon={Info} text="General" link={`/dashboard/projects/${page.params.id}/general`} />
            <SidebarTab Icon={SquareTerminal} text="Commands" link={`/dashboard/projects/${page.params.id}/commands`} />
        {:else}
			<SidebarTab Icon={Rows4} text="Projects" link="/dashboard/projects" />
			<SidebarTab Icon={User} text="Account" link="/dashboard/account" />
		{/if}
	</div>
</div>
