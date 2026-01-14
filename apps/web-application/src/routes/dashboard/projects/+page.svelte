<script lang="ts">
	import ProjectBanner from '$lib/Components/Dashboard/Projects/ProjectBanner.svelte';
	import { BACKEND_URL, user, ProjectNode, logged } from '$lib';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import { makeRequestJson, type UserData } from '$lib/Gun/Utils';

	interface ProjectData {
		name: string;
		icon: string;
		version: string;
		id: string;
	}

	let projects = $state<ProjectData[]>([]);
	let listenerRegistered = false;

	let unsub: (() => unknown) | undefined;

	$effect(() => {
		if (logged.isLogged && !listenerRegistered) {
			listenerRegistered = true;
			unsub = ProjectNode.watchProjects((p) => {
				const project = structuredClone(p);
				console.log('[GUN]: Recieved Object: ', project);
				const i = projects.findIndex((v) => project.id === v.id);

				if (i !== -1) {
					projects[i] = project;
				} else {
					projects.push(project);
				}
			});

			return () => {
				unsub?.();
			}
		}
	});

	onMount(() => {
		return () => {
			unsub?.();
		};
	});
</script>

<div class="h-full w-full p-3">
	<button
		class="text-blue-400 cursor-pointer border-blue-400 px-3 py-2 border-2 rounded-lg hover:rounded-sm hover:text-blue-500 hover:border-blue-500 transition-all"
		onclick={async () => {
			const botInfoResult = await Swal.fire<UserData>({
				title: 'Enter your bot ID',
				input: 'text',
				inputAttributes: {
					autocapitalize: 'off'
				},
				icon: 'info',
				showCancelButton: true,
				confirmButtonText: 'Confirm',
				theme: 'dark',
				showLoaderOnConfirm: true,
				preConfirm: async (inputValue) => {
					if (!/^\d+$/.test(inputValue)) {
						Swal.showValidationMessage('The bot ID must only contain numbers');
						return;
					}

					const projectExists = await new Promise<boolean>((res) =>
						user
							.get('projects')
							.get(inputValue)
							.once((data) => res(!!data))
					);

					if (projectExists) {
						Swal.showValidationMessage('This Project already exists!');
						return;
					}

					try {
						const botInfo = await makeRequestJson(
							BACKEND_URL + '/applications/' + inputValue
						).catch((e) => console.log(e));

						if (!botInfo) {
							Swal.showValidationMessage('Could not fetch bot info. Please try again.');
							return;
						}

						return botInfo as UserData;
					} catch {
						Swal.showValidationMessage('The bot info could not be fetched. Please try again.');
					}
				},
				allowOutsideClick: () => !Swal.isLoading()
			});

			if (botInfoResult.isConfirmed && botInfoResult.value) {
				await Swal.fire({
					title: botInfoResult.value.username,
					imageUrl: botInfoResult.value.avatar
						? `https://cdn.discordapp.com/avatars/${botInfoResult.value.id}/${botInfoResult.value.avatar}`
						: 'https://pbs.twimg.com/media/FvpBu6vXwAAAKe4.jpg',
					text: 'Is the bot your want to build for?',
					theme: 'dark',
					confirmButtonText: 'Yes',
					cancelButtonText: 'No',
					showLoaderOnConfirm: true,
					preConfirm: async () => {
						if (!botInfoResult.value) {
							Swal.showValidationMessage('Ops! Something went wrong. Please try again.');
							return;
						}

						const projectExists = await new Promise<boolean>((res) =>
							user
								.get('projects')
								.get(botInfoResult.value!.id as any)
								.once((data) => res(!!data))
						);

						if (projectExists) {
							Swal.showValidationMessage('This Project already exists!');
							return;
						}

						const projectId = botInfoResult.value.id;
						const projectIcon = botInfoResult.value.avatar
							? `https://cdn.discordapp.com/avatars/${botInfoResult.value.id}/${botInfoResult.value.avatar}`
							: 'https://pbs.twimg.com/media/FvpBu6vXwAAAKe4.jpg';
						const projectVersion = '0.0.1';
						const projectName = botInfoResult.value.username;

						await ProjectNode.createProject({
							id: projectId,
							icon: projectIcon,
							name: projectName,
							version: projectVersion
						}).catch((e) => {
							console.log(e);
							Swal.showValidationMessage('Project could not be created');
						});
					}
				});
			}
		}}
	>
		Create Project
	</button>
	<div class="w-full mt-3 h-11/12 overflow-y-auto">
		<div class="w-full flex flex-wrap gap-4">
			{#each projects as { icon, id, name, version }}
				<ProjectBanner {icon} {id} {name} {version} />
			{/each}
		</div>
	</div>
</div>
