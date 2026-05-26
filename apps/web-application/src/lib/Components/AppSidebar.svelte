<script lang="ts">
	import * as Sidebar from '$lib/Components/ui/sidebar';
	import House from '@lucide/svelte/icons/house';
	import Bot from '@lucide/svelte/icons/bot';
	import Command from '@lucide/svelte/icons/command';
	import FileTerminal from '@lucide/svelte/icons/file-terminal';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import Container from '@lucide/svelte/icons/container';
	import * as DropdownMenu from '$lib/Components/ui/dropdown-menu';
	import { resolve } from '$app/paths';
	import { createSingleton, type Application } from "@disflow-team/local-data"
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	const sidebar = Sidebar.useSidebar();

	let bots = $state<Application[]>([]);

	onMount(() => {
		const db = createSingleton();
		db.appManager.getAll().then((v) => bots = v);
	})

	const sidebarItemsLogic = [
		{
			name: 'Main file',
			icon: Bot,
			href: '/editor/bot'
		},
		{
			name: 'Commands',
			icon: Command,
			href: '/editor/bot/commands'
		},
		{
			name: 'Events',
			icon: FileTerminal,
			href: '/editor/bot/events'
		}
	];
</script>

<Sidebar.Root class="h-[calc(100vh-5rem)] top-20" collapsible="icon">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={resolve(`/${page.url.pathname.split("/")[0]}/editor`)} {...props}>
									<House />
									General
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
			<Sidebar.GroupContent>
				<Sidebar.GroupLabel>Application Logic</Sidebar.GroupLabel>
				<Sidebar.Menu>
					{#each sidebarItemsLogic as item, i (i)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={
										resolve(item.href as unknown as "/")
									} {...props}>
										<item.icon />
										{item.name}
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
			<Sidebar.GroupContent>
				<Sidebar.GroupLabel>Environment</Sidebar.GroupLabel>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<!-- TODO: Add routes to environment -->
								<a href={resolve(`/${page.url.pathname.split("/")[0]}/editor`)} {...props}>
									<Container />
									Variables
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<div class="flex items-center w-full justify-center">
		{#if sidebar.open}
			<Sidebar.Footer class="w-6/7">
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										Select Application
										<ChevronUp class="ms-auto" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
								{#each bots as bot, i (i)}
									<DropdownMenu.Item>
										<a href={resolve(`/${bot.id}/editor`)}>{bot.name}</a>
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Footer>
		{/if}
		<Sidebar.Trigger />
	</div>
</Sidebar.Root>
