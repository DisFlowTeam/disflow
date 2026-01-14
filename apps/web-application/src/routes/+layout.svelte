<script lang="ts">
	import Navbar from '$lib/Components/Navbar.svelte';
	import '../app.css';
	import { createGun } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		console.log('loaded');
		createGun();
		console.log('Gun created');
	});
</script>

<div>
	<Navbar />
	<div class="mt-20">
		{@render children()}
	</div>
</div>
