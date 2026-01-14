<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { logged, type Project, ProjectNode } from '$lib';

	let infoFetched = false;
	let project = $state<Project>();
	let projectData: ProjectNode;

	$effect(() => {
		if (logged.isLogged) {
			if (infoFetched) return;

			projectData = new ProjectNode(page.params.id!);

			projectData
				.metadata()
				.then((p) => {
					infoFetched = true;
					const pro = structuredClone(p);
					project = pro;

					console.log('[GUN] RECIEVED PROJECT OBJECT: ', pro);
				})
				.catch(() => {
					goto('/');
				});
		}
	});
</script>

<div class="h-11/12 w-full pr-4">
	{#if project}
		<div class="h-32 flex w-full rounded-lg border-white/5 border-2 px-5 items-center">
			<img src={project.icon} alt={`${project.name}'s icon`} class="h-4/5 rounded-full" />
			<div class="ml-4">
				<span class="text-white text-3xl font-extrabold">{project.name}</span>
				<br />
				<span class="text-gray-400 text-lg">{project.id}</span>
			</div>
			<div class='ml-auto flex gap-3'>
				<button
					class="text-blue-400 cursor-pointer border-blue-400 px-3 py-2 border-2 rounded-lg hover:rounded-sm hover:text-blue-500 hover:border-blue-500 transition-all"
				>
					Download
				</button>
				<a
					href={`/dashboard/projects/${project.id}/editor`}
					class="text-blue-400 cursor-pointer border-blue-400 px-3 py-2 border-2 rounded-lg hover:rounded-sm hover:text-blue-500 hover:border-blue-500 transition-all"
				>
					Edit Logic
				</a>
			</div>
		</div>
	{/if}
</div>
