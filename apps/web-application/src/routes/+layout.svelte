<script lang="ts">
	import Navbar from '$lib/Components/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />
<div>
	<Navbar />
	<div class="mt-20">
		{@render children()}
	</div>
</div>
