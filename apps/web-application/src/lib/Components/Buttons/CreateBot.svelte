<script lang="ts">
	import * as Dialog from '../ui/dialog';
	import { buttonVariants, Button } from '$lib/Components/ui/button';
	import Label from '$lib/Components/ui/label/label.svelte';
	import Input from '$lib/Components/ui/input/input.svelte';
	import * as InputOTP from '$lib/Components/ui/input-otp';
	import { createSingleton } from '@disflow-team/local-data';
	import { SudoMode } from '@disflow-team/utils';
	import { onMount } from 'svelte';

	interface BotData {
		avatar?: string;
		username: string;
		id: string;
	}

	const { refresh }: {
		refresh: () => unknown;
	} = $props();

	let isOpen = $state(false);
	let token = $state<string>('');
	let description = $state<string>('');
	let data = $state<BotData | undefined>(undefined);
	let loading = $state(false);

	let tokenSaved = $state<string>();
	let otp = $state<string>('');

	let creationState = $state<'new' | 'confirm' | 'digits' | 'error'>('new');

	onMount(() => {
		const db = createSingleton();
		db.appManager.getAll().then(console.log);
	})

	async function handleFinalCreate() {
		if (!data || !tokenSaved || !otp) return;
		const db = createSingleton();
        loading = true;
		if (!SudoMode.isSudo()) {
			const success = await SudoMode.enterSudo(otp);
			if (!success) {
                loading = false;
                creationState = 'error';
                return;
            }
		}

        if(await db.appManager.get(data.id)) {
            creationState = "error";
            loading = false;
            return;
        }

		await db.appManager.create({
			id: data.id,
			name: data.username,
			token: tokenSaved,
			avatar: data.avatar
		});

		creationState = "new";
		isOpen = false;

        loading = false;

		refresh();
	}

	async function handleCreate() {
		if (!token) return;

		loading = true;
		const botData = await fetch('/api/bot/info', {
			headers: {
				'X-Discord-Token': token
			}
		});
		loading = false;

		tokenSaved = structuredClone($state.snapshot(token));

		if (!botData.ok) {
			creationState = 'error';
			return;
		}

		data = (await botData.json()) as BotData;

		creationState = 'confirm';
	}
</script>

<Dialog.Root
	bind:open={isOpen}
	onOpenChange={(o) => {
		if(loading) return isOpen = true; 
		if (o === false) {
			console.log(o);
			creationState = 'new';
			token = '';
			description = '';
			data = undefined;
			otp = '';

			console.log($state.snapshot(creationState));
		}
	}}
>
	<div class="h-1/12 w-full pl-3 flex items-center">
		<Dialog.Trigger type="button" class={buttonVariants({ variant: 'outline' })}>New</Dialog.Trigger
		>
		<Dialog.Content>
			{#if creationState === 'new'}
				<Dialog.Header>
					<Dialog.Title>New Bot</Dialog.Title>
					<Dialog.Description
						>Create a new DisFlow project in order to make a bot.</Dialog.Description
					>
				</Dialog.Header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<Label>Discord Bot Token<span class="text-red-400">*</span></Label>
						<Input
							bind:value={token}
							placeholder="Your Discord Token"
							required
							class="placeholder-shown:border-red-400 placeholder-shown:border"
						/>
					</div>
					<div class="grid gap-3">
						<Label>Description</Label>
						<Input bind:value={description} placeholder="Your bot description" />
					</div>
				</div>
				<Dialog.Footer>
					<Dialog.Close type="button" class={buttonVariants({ variant: 'destructive' })}
						>Cancel</Dialog.Close
					>
					<Button
						onclick={() => void handleCreate()}
						variant="outline"
						type="button"
						disabled={loading}>Create</Button
					>
				</Dialog.Footer>
			{:else if creationState === 'confirm' && data}
				<Dialog.Header>
					<Dialog.Title>Is this your bot?</Dialog.Title>
					<Dialog.Description>Make sure this is your bot before proceeding</Dialog.Description>
				</Dialog.Header>
				<div>
					<img
						src={data.avatar || '/DISFLOW_ICO.png'}
						alt={data.username + "'s avatar"}
						class="rounded-full w-36 h-36 mx-auto"
					/>
					<p class="text-center mt-3 text-2xl">{data.username}</p>
				</div>
				<Dialog.Footer>
					<Dialog.Close type="button" class={buttonVariants({ variant: 'destructive' })}
						>Cancel</Dialog.Close
					>
					<Button type="button" variant="outline" disabled={loading} onclick={async () => {
                        if(!SudoMode.isSudo()) return creationState = 'digits';
                        await handleFinalCreate()
                    }}
						>Confirm</Button
					>
				</Dialog.Footer>
			{:else if creationState === 'digits'}
				<Dialog.Header>
					<Dialog.Title>Passcode</Dialog.Title>
					<Dialog.Description
						>Enter your 6 digit passcode to continue with bot creation</Dialog.Description
					>
				</Dialog.Header>
				<InputOTP.Root maxlength={6} class="justify-center" bind:value={otp}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 3) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(3, 6) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Dialog.Footer>
					<Dialog.Close type="button" class={buttonVariants({ variant: 'destructive' })}
						>Cancel</Dialog.Close
					>
					<Button variant="outline" onclick={handleFinalCreate}>Create</Button>
				</Dialog.Footer>
			{:else if creationState === 'error'}
				<Dialog.Header>
					<Dialog.Title>Error</Dialog.Title>
					<Dialog.Description
						>Something went wrong during bot creation. Please check your Internet connection and
						ensure the 6 digit code you have entered is correct. Also ensure that the bot does not exists already.</Dialog.Description
					>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}
						>OK</Dialog.Close
					>
				</Dialog.Footer>
			{/if}
		</Dialog.Content>
	</div>
</Dialog.Root>
