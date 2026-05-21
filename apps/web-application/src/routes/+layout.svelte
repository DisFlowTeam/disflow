<script lang="ts">
	import Navbar from '$lib/Components/Navbar.svelte';
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />
<div>
	<Navbar />
	<div class="mt-20 h-[calc(100vh-5rem)] w-screen">
		{@render children()}
	</div>
</div>
