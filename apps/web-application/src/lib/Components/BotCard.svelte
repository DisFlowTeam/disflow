<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	const {
		username,
		avatar,
		description,
		lastModified,
		id
	}: {
		username: string;
		avatar: string;
		description?: string;
		lastModified: Date;
		id: string;
	} = $props();

	let text: string = $state('');

	onMount(() => {
		text = `${lastModified.getDate()}/${lastModified.getMonth()}/${lastModified.getFullYear()}`;
	});
</script>

<a href={resolve(`/${id}/editor`)}>
	<div class="w-72 h-32 flex rounded-md border shadow border-neutral-600">
		<div class="h-full overflow-hidden w-3/4 p-3 flex flex-col justify-center">
			<p class="text-lg text-white">{username}</p>
			<p class="text-gray-200 overflow-hidden">{description || 'A DisFlow project'}</p>
			<p class="text-xs text-gray-400">{text}</p>
		</div>
		<div class="h-full w-1/4 flex items-center justify-center p-1">
			<img src={avatar} alt="The bot's avatar" class="w-3/4 rounded-full" />
		</div>
	</div>
</a>
