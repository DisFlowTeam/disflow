<script lang="ts">
	import { BACKEND_URL } from '$lib/Gun';
	import { identify, type UserData } from '$lib/Gun/Utils';
	import { onMount } from 'svelte';

	let userData = $state<undefined | UserData>(undefined);

	onMount(async () => {
		userData = await identify();
	});
</script>

<nav
	class="w-screen h-20 bg-slate-950 border-b border-white/5 flex items-center absolute top-0 left-0 z-30"
>
	<div class="h-16 overflow-hidden flex justify-center items-center">
		<img src="/DISFLOW_ICO.png" alt="Disflow Logo" class="h-4/5 shadow-blue-950 drop-shadow-2xl ml-4 rounded-lg" />
		<span class="text-2xl font-extrabold ml-4">
			<span class="text-white">DIS</span><span class="text-blue-400">FLOW</span>
		</span>
	</div>
	{#if userData}
		<div class="flex items-center ml-auto h-full mr-9">
			<img
				src={userData.avatar
					? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
					: 'https://pbs.twimg.com/media/FvpBu6vXwAAAKe4.jpg'}
				alt={`${userData.username}'s avatar'`}
				class="rounded-full h-3/5 mr-2"
			/>
			<span class="text-white text-xl">{userData.username}</span>
		</div>
	{:else}
		<a
			class="h-10 ml-auto mr-10 flex items-center px-4 rounded-lg text-gray-900 bg-blue-400 font-semibold"
			href={BACKEND_URL + '/auth/discord'}
		>
			Login with Discord
		</a>
	{/if}
</nav>
