<script>
	import { page } from '$app/state';
	import { createGun, hasUser, login, signUp } from '$lib';
	import Sidebar from '$lib/Components/Dashboard/Sidebar/Sidebar.svelte';
	import { identify } from '$lib/Gun/Utils';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(async () => {
		createGun();

		const userData = await identify();

		if (!userData) return window.location.replace('/');

		const userExists = await hasUser(userData.id);

		if (userExists) {
			login(userData.id);
		} else {
			signUp();
		}
	});
</script>

{#if page.url.pathname.includes('/editor')}
	{@render children?.()}
{:else}
	<div class="w-screen flex h-[calc(100vh-5rem)] bg-slate-950">
		<Sidebar />
		<div class="w-4/5 h-full p-3">
			{@render children()}
		</div>
	</div>
{/if}
