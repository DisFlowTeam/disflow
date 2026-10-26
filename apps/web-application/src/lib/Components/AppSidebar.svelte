<script lang="ts">
import { type Application, createSingleton } from "@disflow-team/local-data";
import Bot from "@lucide/svelte/icons/bot";
import ChevronUp from "@lucide/svelte/icons/chevron-up";
import Command from "@lucide/svelte/icons/command";
import Container from "@lucide/svelte/icons/container";
import FileTerminal from "@lucide/svelte/icons/file-terminal";
import House from "@lucide/svelte/icons/house";
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import * as DropdownMenu from "$lib/Components/ui/dropdown-menu";
import * as Sidebar from "$lib/Components/ui/sidebar";
	import { redirect } from "@sveltejs/kit";

const sidebar = Sidebar.useSidebar();

let bots = $state<Application[]>([]);

onMount(() => {
	const db = createSingleton();
	db.appManager.getAll().then((v) => (bots = v));
});

const id = page.params.id;

let botsFiltered = $derived(
	bots
		.filter(v => v.id !== id)
)

if(!id) redirect(404, "/404")

const sidebarItemsLogic = [
	{
		name: "Main file",
		icon: Bot,
		href: resolve("/[id]/editor/bot", { id }),
	},
	{
		name: "Commands",
		icon: Command,
		href: resolve("/[id]/editor/bot/commands", { id }),
	},
	{
		name: "Events",
		icon: FileTerminal,
		href: resolve("/[id]/editor/bot/events", { id }),
	},
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
							<!-- Weird biome sveltekit support -->
							{#snippet child({ props: _props })}
								<a href={resolve("/[id]/editor", { id })} {..._props}>
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
								{#snippet child({ props: _props })}
									<a href={
										resolve(item.href as unknown as "/")
									} {..._props}>
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
							{#snippet child({ props: _props })}
								<!-- TODO: Add routes to environment -->
								<a href={resolve("/[id]/editor/bot/variables", { id })} {..._props}>
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
								{#snippet child({ props: _props })}
									<Sidebar.MenuButton {..._props}>
										{bots.find(v => v.id === id)?.name || "Select Application"}
										<ChevronUp class="ms-auto" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
								{#each botsFiltered as bot, i (i)}
									<DropdownMenu.Item>
										<a href={resolve("/[id]/editor", { id: bot.id })}>{bot.name}</a>
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
