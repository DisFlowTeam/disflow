<script lang="ts">
import ExternalLink from "@lucide/svelte/icons/external-link";
import { resolve } from "$app/paths";
import { Button } from "$lib/Components/ui/button";
</script>

<nav
	class="absolute top-0 left-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/5 bg-neutral-900/90 px-3 backdrop-blur"
>
	<a href={resolve("/")} class="flex h-16 items-center overflow-hidden pl-1">
		<img
			src="/DISFLOW_ICO.png"
			alt="Disflow Logo"
			class="mr-3 h-10 w-10 rounded-sm object-contain"
		/>
		<span class="text-2xl font-bold">DIS</span>
		<span class="text-2xl font-bold text-blue-500">FLOW</span>
	</a>

	<div class="flex items-center gap-1 pr-1">
		<Button variant="ghost" size="sm" href={resolve("/bots")}>
			Workspace
		</Button>
		<Button
			variant="ghost"
			size="icon-sm"
			href="https://github.com/DisFlowTeam/disflow"
			target="_blank"
			rel="noreferrer"
			aria-label="DisFlow on GitHub"
			title="DisFlow on GitHub"
		>
			<ExternalLink class="size-4" />
		</Button>
	</div>
</nav>
