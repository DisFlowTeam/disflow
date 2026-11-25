<script lang="ts">
import type { Application } from "@disflow-team/local-data";
import Download from "@lucide/svelte/icons/download";
import { Button } from "$lib/Components/ui/button";
import { generateBotProject } from "$lib/codegen/exportBot";
import { createZip, downloadZip } from "$lib/codegen/zip";

let { app }: { app: Application | null } = $props();

let exporting = $state(false);
let error = $state<string | null>(null);

async function exportBot() {
	if (!app) return;

	exporting = true;
	error = null;

	try {
		const project = await generateBotProject(app);

		if (project.eventCount + project.commandCount === 0) {
			error = "Create at least one event or command handler before exporting.";
			return;
		}

		const slug =
			app.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "") || "disflow";

		downloadZip(await createZip(project.files), `${slug}-bot`);
	} catch (cause) {
		error =
			cause instanceof Error ? cause.message : "Unable to export the bot.";
	} finally {
		exporting = false;
	}
}
</script>

<div class="flex flex-col items-end gap-2">
	<Button
		class="h-10 gap-2 bg-blue-600 px-4 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
		onclick={exportBot}
		disabled={exporting || !app}
	>
		<Download class="size-4" />
		{exporting ? "Exporting…" : "Export bot"}
	</Button>
	{#if error}
		<p
			class="max-w-xs rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-right text-xs text-red-300"
		>
			{error}
		</p>
	{/if}
</div>
