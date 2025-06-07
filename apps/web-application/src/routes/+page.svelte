<script lang="ts">
	import Connection from '$lib/Components/Nodes/Connection.svelte';
</script>

<div id="injectCanvas"></div>
<div class="w-screen h-[calc(100vh-5rem)] bg-plurple-950 flex justify-center items-center relative">
	<span class="text-white font-bold lg:text-6xl md:text-5xl text-3xl z-30"
		>DIS<span class="text-blue-400">FLOW</span></span
	>
	<Connection />
</div>
<div class="w-screen h-screen absolute top-[100vh] z-10 flex justify-center items-center">
	<div class="w-[10vw] h-[10vw] bg-amber-300 blur-[10vw] rounded-full"></div>
</div>
<div class="w-screen h-screen bg-gray-900 flex justify-center items-center z-0">
	<div class="w-[80%] text-center z-20">
		<div class="text-white text-4xl font-bold lg:text-6xl">
			<p class="mb-4">Create a <span class="text-blue-400">Free</span> Discord App</p><span class="bg-blue-400 px-3 pb-2 rounded-lg">Without Code</span>
		</div>
		<div class="lg:w-[60%] w-full mx-auto mt-10">
			<div class="text-lg lg:text-xl text-gray-300">
				Create your App. Fully customizable and free forever. Use our node-based editor to take full
				control of your bot is bring your own solutions to your problems. No strings attached.
			</div>
		</div>
		<div class="mx-auto mt-12">
			<a href="/auth/discord" class="rounded-full lg:px-10 lg:py-4 px-5 py-2 bg-blue-400 hover:shadow-lg transition-shadow text-gray-900 lg:mr-3 mr-1 lg:text-lg font-semibold">Get Started Now</a>
			<a href="/demo" class="rounded-full lg:px-10 lg:py-4 px-5 py-2 text-blue-400 hover:shadow-lg transition-shadow border-2 lg:ml-3 ml-1 lg:text-lg font-semibold">Try a Demo</a>
		</div>
	</div>
</div>