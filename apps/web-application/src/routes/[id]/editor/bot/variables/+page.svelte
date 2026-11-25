<script lang="ts">
import { Application, createSingleton } from "@disflow-team/local-data";
import { SudoMode } from "@disflow-team/utils";
import Download from "@lucide/svelte/icons/download";
import Eye from "@lucide/svelte/icons/eye";
import EyeOff from "@lucide/svelte/icons/eye-off";
import KeyRound from "@lucide/svelte/icons/key-round";
import Lock from "@lucide/svelte/icons/lock";
import Plus from "@lucide/svelte/icons/plus";
import Search from "@lucide/svelte/icons/search";
import ShieldCheck from "@lucide/svelte/icons/shield-check";
import Trash2 from "@lucide/svelte/icons/trash-2";
import Unlock from "@lucide/svelte/icons/unlock";
import { onMount } from "svelte";
import { page } from "$app/state";
import BotPageHeader from "$lib/Components/Dashboard/BotPageHeader.svelte";
import EmptyState from "$lib/Components/Dashboard/EmptyState.svelte";
import { Button } from "$lib/Components/ui/button";
import * as Dialog from "$lib/Components/ui/dialog";
import Input from "$lib/Components/ui/input/input.svelte";
import * as InputOTP from "$lib/Components/ui/input-otp";
import Label from "$lib/Components/ui/label/label.svelte";
import { downloadText } from "$lib/download";

const id = $derived(page.params.id ?? "");

let app = $state<Application | null>(null);
let variables = $state<string[]>([]);
let decrypted = $state<Record<string, string>>({});
let revealedKeys = $state<string[]>([]);
let loading = $state(true);
let errorMessage = $state<string | null>(null);
let unlocked = $state(false);
let search = $state("");
let exporting = $state(false);

let createOpen = $state(false);
let variableName = $state("");
let variableValue = $state("");
let showValue = $state(false);
let formError = $state<string | null>(null);
let saving = $state(false);

let unlockOpen = $state(false);
let unlockPin = $state("");
let unlockError = $state<string | null>(null);
let unlocking = $state(false);
let pendingAction: (() => void) | null = null;

let deleteOpen = $state(false);
let selectedKey = $state<string | null>(null);
let deleteError = $state<string | null>(null);
let deleting = $state(false);

const filteredVariables = $derived.by(() => {
	const query = search.trim().toLowerCase();
	return query
		? variables.filter((key) => key.toLowerCase().includes(query))
		: variables;
});

const nameValid = $derived(
	/^[A-Z_][A-Z0-9_]*$/.test(variableName) && variableName.length <= 64,
);
const nameTaken = $derived(variables.includes(variableName));
const canSave = $derived(
	nameValid && variableValue.length > 0 && !saving,
);

onMount(() => {
	void load();
});

async function load(showLoading = true) {
	if (showLoading) loading = true;
	errorMessage = null;

	try {
		if (!id) {
			app = null;
			variables = [];
			decrypted = {};
			return;
		}

		const found = await createSingleton().appManager.get(id);
		app = found ?? null;
		variables = found
			? [...found.schema.environment.variables.keys()].sort()
			: [];

		unlocked = SudoMode.isSudo();
		revealedKeys = revealedKeys.filter((key) => variables.includes(key));

		if (unlocked) {
			await decryptAll();
		} else {
			decrypted = {};
			revealedKeys = [];
		}
	} catch (cause) {
		errorMessage =
			cause instanceof Error
				? cause.message
				: "Unable to load environment variables.";
	} finally {
		if (showLoading) loading = false;
	}
}

async function decryptAll() {
	if (!app || !SudoMode.isSudo()) {
		decrypted = {};
		return;
	}

	const values: Record<string, string> = {};

	for (const [key, encrypted] of app.schema.environment.variables) {
		try {
			values[key] = await Application.decryptString(encrypted);
		} catch {
			values[key] = "[unable to decrypt]";
		}
	}

	decrypted = values;
}

function withSudo(action: () => void) {
	if (SudoMode.isSudo()) {
		unlocked = true;
		action();
		return;
	}

	pendingAction = action;
	unlockPin = "";
	unlockError = null;
	unlockOpen = true;
}

async function confirmUnlock() {
	if (unlockPin.length !== 6) {
		unlockError = "Enter your 6-digit passcode.";
		return;
	}

	unlocking = true;
	unlockError = null;

	try {
		const success = await SudoMode.enterSudo(unlockPin);

		if (!success) {
			unlockError = "That passcode is incorrect.";
			return;
		}

		const action = pendingAction;
		pendingAction = null;
		unlocked = true;
		unlockOpen = false;

		await decryptAll();
		action?.();
	} catch (cause) {
		unlockError =
			cause instanceof Error ? cause.message : "Unable to unlock.";
	} finally {
		unlocking = false;
	}
}

function lockEnvironment() {
	SudoMode.exitSudo();
	unlocked = false;
	decrypted = {};
	revealedKeys = [];
}

function openCreate() {
	withSudo(() => {
		variableName = "";
		variableValue = "";
		showValue = false;
		formError = null;
		createOpen = true;
	});
}

function resetCreate() {
	variableName = "";
	variableValue = "";
	showValue = false;
	formError = null;
}

function handleNameInput(event: Event) {
	const input = event.currentTarget as HTMLInputElement;

	let next = input.value
		.toUpperCase()
		.replace(/[^A-Z0-9_]/g, "_")
		.slice(0, 64);

	if (next.length > 0 && !/^[A-Z_]/.test(next)) {
		next = `_${next}`.slice(0, 64);
	}

	variableName = next;
	formError = null;
}

async function saveVariable() {
	if (!app) return;

	formError = null;

	if (!nameValid) {
		formError =
			"Use uppercase letters, numbers and underscores. The name must start with a letter or underscore.";
		return;
	}

	if (variableValue.length === 0) {
		formError = "A value is required.";
		return;
	}

	saving = true;

	try {
		await app.createVariable(variableName, variableValue);
		createOpen = false;
		resetCreate();
		await load(false);
	} catch (cause) {
		formError =
			cause instanceof Error
				? cause.message
				: "Unable to save this variable.";
	} finally {
		saving = false;
	}
}

function toggleReveal(key: string) {
	if (!SudoMode.isSudo()) {
		withSudo(() => {
			if (!revealedKeys.includes(key)) {
				revealedKeys = [...revealedKeys, key];
			}
		});
		return;
	}

	unlocked = true;
	revealedKeys = revealedKeys.includes(key)
		? revealedKeys.filter((value) => value !== key)
		: [...revealedKeys, key];
}

function exportEnv() {
	withSudo(() => void doExport());
}

async function doExport() {
	if (!app) return;

	if (variables.length === 0) {
		errorMessage = "Add at least one variable before exporting.";
		return;
	}

	exporting = true;
	errorMessage = null;

	try {
		const content = await app.exportVariables();
		downloadText(`${content}\n`, ".env");
	} catch (cause) {
		errorMessage =
			cause instanceof Error ? cause.message : "Unable to export .env.";
	} finally {
		exporting = false;
	}
}

function requestDelete(key: string) {
	selectedKey = key;
	deleteError = null;
	deleteOpen = true;
}

async function confirmDelete() {
	if (!app || !selectedKey) return;

	deleting = true;
	deleteError = null;

	try {
		await app.deleteVariable(selectedKey);
		revealedKeys = revealedKeys.filter((key) => key !== selectedKey);
		deleteOpen = false;
		selectedKey = null;
		await load(false);
	} catch (cause) {
		deleteError =
			cause instanceof Error
				? cause.message
				: "Unable to delete this variable.";
	} finally {
		deleting = false;
	}
}
</script>

<svelte:head>
	<title>{app?.name ?? "Bot"} · Environment</title>
</svelte:head>

<div class="min-h-full pb-16">
	<div
		class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8"
	>
		<BotPageHeader
			botName={app?.name ?? "Loading application"}
			avatar={app?.schema.avatar}
			title="Environment variables"
			description="Store the secrets your bot needs. Values are encrypted with your passcode before they are written to local storage."
			meta={loading
				? []
				: [
						`${variables.length} ${variables.length === 1 ? "variable" : "variables"}`,
						unlocked ? "Unlocked" : "Locked",
						"Encrypted at rest",
					]}
		>
			{#if unlocked}
				<Button variant="outline" size="sm" onclick={lockEnvironment}>
					<Lock class="size-4" />
					Lock
				</Button>
			{:else}
				<Button
					variant="outline"
					size="sm"
					onclick={() => withSudo(() => {})}
				>
					<Unlock class="size-4" />
					Unlock
				</Button>
			{/if}
			<Button
				variant="outline"
				size="sm"
				onclick={exportEnv}
				disabled={exporting || variables.length === 0}
			>
				<Download class="size-4" />
				{exporting ? "Exporting…" : "Export .env"}
			</Button>
			<Button
				class="h-10 gap-2 bg-blue-600 px-4 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
				onclick={openCreate}
				disabled={!app || loading}
			>
				<Plus class="size-4" />
				New variable
			</Button>
		</BotPageHeader>

		{#if errorMessage}
			<div
				class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
			>
				{errorMessage}
			</div>
		{/if}

		{#if !loading && !unlocked}
			<div
				class="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-200/80 sm:flex-row sm:items-center"
			>
				<Lock class="size-4 shrink-0" />
				<p class="flex-1">
					Values are encrypted. Unlock with your passcode to reveal values,
					add variables, or export your <code class="font-mono">.env</code> file.
				</p>
				<Button
					variant="outline"
					size="sm"
					onclick={() => withSudo(() => {})}
				>
					Unlock
				</Button>
			</div>
		{/if}

		<div
			class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="relative w-full sm:max-w-xs">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					bind:value={search}
					placeholder="Search variables"
					class="h-10 pl-9"
				/>
			</div>
			<p class="text-xs text-muted-foreground">
				Showing <span class="font-medium text-foreground"
					>{filteredVariables.length}</span
				> of {variables.length}
			</p>
		</div>

		{#if loading}
			<div class="space-y-2">
				{#each [0, 1, 2] as item (item)}
					<div
						class="h-16 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
					></div>
				{/each}
			</div>
		{:else if !app}
			<EmptyState
				icon={KeyRound}
				title="Application not found"
				description="This application does not exist in the local workspace. It may have been deleted."
			/>
		{:else if variables.length === 0}
			<EmptyState
				icon={KeyRound}
				title="No environment variables"
				description="Add tokens, IDs and other secrets your bot needs. Values are encrypted before being stored."
			>
				<Button
					class="gap-2 bg-blue-600 text-white hover:bg-blue-500"
					onclick={openCreate}
				>
					<Plus class="size-4" />
					Add your first variable
				</Button>
			</EmptyState>
		{:else if filteredVariables.length === 0}
			<EmptyState
				icon={Search}
				title="No matching variables"
				description="Try a different name, or clear the search to see every variable."
			>
				<Button variant="outline" onclick={() => (search = "")}>
					Clear search
				</Button>
			</EmptyState>
		{:else}
			<div
				class="overflow-hidden rounded-xl border border-white/5 bg-card/40"
			>
				{#each filteredVariables as key (key)}
					<div
						class="flex items-center gap-3 border-b border-white/5 p-4 last:border-0"
					>
						<div
							class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400"
						>
							<KeyRound class="size-4" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate font-mono text-sm font-medium">{key}</p>
							<p
								class="truncate font-mono text-xs text-muted-foreground"
							>
								{revealedKeys.includes(key)
									? decrypted[key] || "(empty)"
									: "••••••••••••"}
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							class="text-muted-foreground hover:text-foreground"
							aria-label={`${revealedKeys.includes(key) ? "Hide" : "Reveal"} ${key}`}
							title={`${revealedKeys.includes(key) ? "Hide" : "Reveal"} ${key}`}
							onclick={() => toggleReveal(key)}
						>
							{#if revealedKeys.includes(key)}
								<EyeOff class="size-4" />
							{:else}
								<Eye class="size-4" />
							{/if}
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							class="text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
							aria-label={`Delete ${key}`}
							title={`Delete ${key}`}
							onclick={() => requestDelete(key)}
						>
							<Trash2 class="size-4" />
						</Button>
					</div>
				{/each}
			</div>
		{/if}

		<div
			class="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-muted-foreground"
		>
			<ShieldCheck class="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
			<span>
				Variable names are stored locally in plain text. Values are encrypted with
				your master key and only decrypted in memory while the environment is
				unlocked.
			</span>
		</div>
	</div>
</div>

<Dialog.Root
	bind:open={createOpen}
	onOpenChange={(open) => {
		if (!open) resetCreate();
	}}
>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="text-lg">Add environment variable</Dialog.Title>
			<Dialog.Description>
				The name is stored locally; the value is encrypted with your passcode.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="variable-name">Name</Label>
				<Input
					id="variable-name"
					value={variableName}
					oninput={handleNameInput}
					placeholder="DISCORD_TOKEN"
					autocomplete="off"
					class="font-mono"
				/>
				<p class="text-xs text-muted-foreground">
					Uppercase letters, numbers and underscores. Must start with a letter or
					underscore.
				</p>
				{#if nameTaken && variableName.length > 0}
					<p class="text-xs text-amber-300">
						This will replace the existing value for {variableName}.
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="variable-value">Value</Label>
					<button
						type="button"
						class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
						onclick={() => (showValue = !showValue)}
					>
						{#if showValue}
							<EyeOff class="size-3.5" />
							Hide
						{:else}
							<Eye class="size-3.5" />
							Show
						{/if}
					</button>
				</div>
				<Input
					id="variable-value"
					type={showValue ? "text" : "password"}
					bind:value={variableValue}
					placeholder="Value"
					autocomplete="off"
					class="font-mono"
				/>
				<p class="text-xs text-muted-foreground">
					Encrypted before being written to local storage.
				</p>
			</div>

			{#if formError}
				<p
					class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
				>
					{formError}
				</p>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (createOpen = false)}>
				Cancel
			</Button>
			<Button
				class="bg-blue-600 text-white hover:bg-blue-500"
				disabled={!canSave}
				onclick={saveVariable}
			>
				{saving ? "Saving…" : nameTaken ? "Replace value" : "Add variable"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	bind:open={unlockOpen}
	onOpenChange={(open) => {
		if (!open) {
			pendingAction = null;
			unlockPin = "";
			unlockError = null;
		}
	}}
>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-lg">Unlock environment</Dialog.Title>
			<Dialog.Description>
				Enter your 6-digit passcode to decrypt values, add variables, or export
				your <code class="font-mono">.env</code> file.
			</Dialog.Description>
		</Dialog.Header>

		<InputOTP.Root
			maxlength={6}
			class="justify-center"
			bind:value={unlockPin}
		>
			{#snippet children({ cells: _cells })}
				<InputOTP.Group>
					{#each _cells.slice(0, 3) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each _cells.slice(3, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>

		{#if unlockError}
			<p
				class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-300"
			>
				{unlockError}
			</p>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (unlockOpen = false)}>
				Cancel
			</Button>
			<Button
				class="bg-blue-600 text-white hover:bg-blue-500"
				disabled={unlocking || unlockPin.length !== 6}
				onclick={confirmUnlock}
			>
				{unlocking ? "Unlocking…" : "Unlock"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	bind:open={deleteOpen}
	onOpenChange={(open) => {
		if (!open) {
			selectedKey = null;
			deleteError = null;
		}
	}}
>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-lg">Delete environment variable</Dialog.Title>
			<Dialog.Description>
				{selectedKey
					? `This will permanently remove ${selectedKey} from this workspace.`
					: "This variable will be permanently removed."}
			</Dialog.Description>
		</Dialog.Header>

		{#if selectedKey}
			<div class="rounded-xl border border-white/5 bg-black/20 p-3">
				<p class="font-mono text-sm">{selectedKey}</p>
			</div>
		{/if}

		{#if deleteError}
			<p
				class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
			>
				{deleteError}
			</p>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteOpen = false)}>
				Keep variable
			</Button>
			<Button
				variant="destructive"
				disabled={deleting}
				onclick={confirmDelete}
			>
				{deleting ? "Deleting…" : "Delete variable"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
