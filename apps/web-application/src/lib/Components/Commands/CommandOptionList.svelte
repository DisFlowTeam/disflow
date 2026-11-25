<script lang="ts">
import type {
	CommandOption,
	CommandOptionChannelType,
	CommandOptionType,
} from "@disflow-team/local-data";
import Plus from "@lucide/svelte/icons/plus";
import Trash2 from "@lucide/svelte/icons/trash-2";
import { Button } from "$lib/Components/ui/button";
import Input from "$lib/Components/ui/input/input.svelte";
import Label from "$lib/Components/ui/label/label.svelte";
import {
	COMMAND_CHANNEL_TYPES,
	COMMAND_OPTION_TYPES,
	CONTAINER_OPTION_TYPES,
	isChoiceType,
	isContainerType,
	isNumericType,
	optionTypeLabel,
	SIMPLE_OPTION_TYPES,
} from "$lib/Constants/CommandOptions";
import Self from "./CommandOptionList.svelte";

type Context = "command" | "group" | "subcommand";
type NumericField = "minLength" | "maxLength" | "minValue" | "maxValue";

let {
	options,
	context,
	path,
	onChange,
}: {
	options: CommandOption[];
	context: Context;
	path: string;
	onChange?: () => void;
} = $props();

const hasContainers = $derived(
	options.some((option) => isContainerType(option.type)),
);
const hasSimple = $derived(
	options.some((option) => !isContainerType(option.type)),
);
const atLimit = $derived(options.length >= 25);

const allowedTypes = $derived.by((): CommandOptionType[] => {
	if (context === "group") return ["subcommand"];
	if (context === "subcommand") return SIMPLE_OPTION_TYPES;

	if (hasContainers && !hasSimple) return CONTAINER_OPTION_TYPES;
	if (hasSimple && !hasContainers) return SIMPLE_OPTION_TYPES;

	return COMMAND_OPTION_TYPES.map((entry) => entry.value);
});

const showArgument = $derived(
	context === "subcommand" || (context === "command" && !hasContainers),
);
const showSubcommand = $derived(
	context === "group" || (context === "command" && !hasSimple),
);
const showGroup = $derived(context === "command" && !hasSimple);

function typesForOption(option: CommandOption) {
	const allowed = allowedTypes.includes(option.type)
		? allowedTypes
		: [option.type, ...allowedTypes];

	return COMMAND_OPTION_TYPES.filter((entry) => allowed.includes(entry.value));
}

function addOption(type: CommandOptionType) {
	const option: CommandOption = {
		name: "",
		description: "",
		type,
	};

	if (isContainerType(type)) {
		option.options = [];
	} else {
		option.required = false;
	}

	options.push(option);
	onChange?.();
}

function removeOption(index: number) {
	options.splice(index, 1);
	onChange?.();
}

function handleNameInput(option: CommandOption, event: Event) {
	const input = event.currentTarget as HTMLInputElement;

	option.name = input.value
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9_-]/g, "")
		.replace(/-{2,}/g, "-")
		.slice(0, 32);

	onChange?.();
}

function handleTypeChange(option: CommandOption) {
	if (isContainerType(option.type)) {
		option.options ??= [];
		option.required = undefined;
		option.autocomplete = undefined;
		option.choices = undefined;
		option.channelTypes = undefined;
		option.minLength = undefined;
		option.maxLength = undefined;
		option.minValue = undefined;
		option.maxValue = undefined;
	} else {
		option.options = undefined;
	}

	if (!isChoiceType(option.type)) {
		option.choices = undefined;
		option.autocomplete = undefined;
	}

	if (option.type !== "text") {
		option.minLength = undefined;
		option.maxLength = undefined;
	}

	if (!isNumericType(option.type)) {
		option.minValue = undefined;
		option.maxValue = undefined;
	}

	if (option.type !== "channel") {
		option.channelTypes = undefined;
	}

	onChange?.();
}

function setOptionalNumber(
	option: CommandOption,
	field: NumericField,
	event: Event,
) {
	const raw = (event.currentTarget as HTMLInputElement).value.trim();
	option[field] = raw.length === 0 ? undefined : Number(raw);
	onChange?.();
}

function setRequired(option: CommandOption, event: Event) {
	option.required = (event.currentTarget as HTMLInputElement).checked;
	onChange?.();
}

function setAutocomplete(option: CommandOption, event: Event) {
	option.autocomplete = (event.currentTarget as HTMLInputElement).checked;

	if (option.autocomplete) {
		option.choices = undefined;
	}

	onChange?.();
}

function addChoice(option: CommandOption) {
	option.choices = [...(option.choices ?? []), { name: "", value: "" }];
	onChange?.();
}

function removeChoice(option: CommandOption, index: number) {
	option.choices = (option.choices ?? []).filter(
		(_, choiceIndex) => choiceIndex !== index,
	);
	onChange?.();
}

function toggleChannelType(
	option: CommandOption,
	type: CommandOptionChannelType,
) {
	const current = option.channelTypes ?? [];

	option.channelTypes = current.includes(type)
		? current.filter((value) => value !== type)
		: [...current, type];
	onChange?.();
}
</script>

<div class="space-y-3">
	{#if options.length === 0}
		<p
			class="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-4 text-center text-xs text-muted-foreground"
		>
			{#if context === "group"}
				No subcommands yet.
			{:else if context === "subcommand"}
				No arguments yet.
			{:else}
				No arguments or subcommands yet.
			{/if}
		</p>
	{/if}

	{#each options as option, index (option)}
		<div class="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<div class="flex min-w-0 items-center gap-2">
						<span
							class="shrink-0 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-medium tracking-wide text-blue-300 uppercase"
						>
							{optionTypeLabel(option.type)}
						</span>
						<span class="truncate text-[10px] text-muted-foreground"
							>{path}</span
						>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					class="text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
					aria-label={`Remove option ${index + 1}`}
					onclick={() => removeOption(index)}
				>
					<Trash2 class="size-4" />
				</Button>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<div class="space-y-2">
					<Label>Name</Label>
					<Input
						value={option.name}
						oninput={(event) => handleNameInput(option, event)}
						placeholder="message"
						autocomplete="off"
						class="font-mono"
					/>
					<p class="text-[11px] text-muted-foreground">
						Lowercase letters, numbers, hyphens and underscores.
					</p>
				</div>

				<div class="space-y-2">
					<Label>Type</Label>
					<select
						class="h-9 w-full rounded-md border border-input bg-neutral-900 px-2.5 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
						value={option.type}
						onchange={(event) => {
							option.type = (event.currentTarget as HTMLSelectElement)
								.value as CommandOptionType;
							handleTypeChange(option);
						}}
					>
						{#each typesForOption(option) as type (type.value)}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="space-y-2">
				<Label>Description</Label>
				<Input
					bind:value={option.description}
					maxlength={100}
					placeholder="What should the user enter?"
				/>
			</div>

			{#if !isContainerType(option.type)}
				<label class="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						class="size-4 accent-blue-600"
						checked={option.required ?? false}
						onchange={(event) => setRequired(option, event)}
					/>
					Required
				</label>
			{/if}

			{#if option.type === "text"}
				<div class="grid gap-3 sm:grid-cols-2">
					<div class="space-y-2">
						<Label>Minimum length</Label>
						<Input
							type="number"
							min="0"
							value={option.minLength ?? ""}
							oninput={(event) =>
								setOptionalNumber(option, "minLength", event)}
						/>
					</div>
					<div class="space-y-2">
						<Label>Maximum length</Label>
						<Input
							type="number"
							min="1"
							value={option.maxLength ?? ""}
							oninput={(event) =>
								setOptionalNumber(option, "maxLength", event)}
						/>
					</div>
				</div>
			{/if}

			{#if isNumericType(option.type)}
				<div class="grid gap-3 sm:grid-cols-2">
					<div class="space-y-2">
						<Label>Minimum value</Label>
						<Input
							type="number"
							step={option.type === "integer" ? "1" : "any"}
							value={option.minValue ?? ""}
							oninput={(event) =>
								setOptionalNumber(option, "minValue", event)}
						/>
					</div>
					<div class="space-y-2">
						<Label>Maximum value</Label>
						<Input
							type="number"
							step={option.type === "integer" ? "1" : "any"}
							value={option.maxValue ?? ""}
							oninput={(event) =>
								setOptionalNumber(option, "maxValue", event)}
						/>
					</div>
				</div>
			{/if}

			{#if isChoiceType(option.type)}
				<div class="space-y-3 rounded-lg border border-white/5 bg-black/10 p-3">
					<div
						class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
					>
						<div>
							<p class="text-xs font-medium">Choices</p>
							<p class="text-[11px] text-muted-foreground">
								Optional fixed choices users can pick from.
							</p>
						</div>
						<label class="flex items-center gap-2 text-xs">
							<input
								type="checkbox"
								class="size-3.5 accent-blue-600"
								checked={option.autocomplete ?? false}
								onchange={(event) => setAutocomplete(option, event)}
							/>
							Autocomplete
						</label>
					</div>

					{#if option.autocomplete}
						<p class="text-[11px] text-muted-foreground">
							Choices are disabled while autocomplete is on.
						</p>
					{:else}
						<div class="space-y-2">
							{#each option.choices ?? [] as choice, choiceIndex (choiceIndex)}
								<div class="flex gap-2">
									<Input
										bind:value={choice.name}
										placeholder="Label"
										class="h-8"
									/>
									<Input
										bind:value={choice.value}
										placeholder={option.type === "text" ? "Value" : "Number"}
										class="h-8"
									/>
									<Button
										variant="ghost"
										size="icon-sm"
										class="shrink-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
										aria-label={`Remove choice ${choiceIndex + 1}`}
										onclick={() => removeChoice(option, choiceIndex)}
									>
										<Trash2 class="size-3.5" />
									</Button>
								</div>
							{/each}

							<Button
								variant="outline"
								size="sm"
								class="gap-1.5"
								disabled={(option.choices?.length ?? 0) >= 25}
								onclick={() => addChoice(option)}
							>
								<Plus class="size-3.5" />
								Add choice
							</Button>
						</div>
					{/if}
				</div>
			{/if}

			{#if option.type === "channel"}
				<div class="space-y-2">
					<p class="text-xs font-medium">Allowed channel types</p>
					<div class="flex flex-wrap gap-1.5">
						{#each COMMAND_CHANNEL_TYPES as channel (channel.value)}
							<button
								type="button"
								aria-pressed={option.channelTypes?.includes(channel.value) ??
									false}
								onclick={() => toggleChannelType(option, channel.value)}
								class="rounded-md border px-2.5 py-1 text-[11px] transition-colors {option.channelTypes?.includes(
									channel.value,
								)
									? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
									: 'border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground'}"
							>
								{channel.label}
							</button>
						{/each}
					</div>
					<p class="text-[11px] text-muted-foreground">
						Leave all off to allow any channel type.
					</p>
				</div>
			{/if}

			{#if isContainerType(option.type) && option.options}
				<div class="rounded-lg border border-white/5 bg-black/10 p-3">
					<div class="flex items-center justify-between">
						<p class="text-xs font-medium">
							{option.type === "subcommand_group"
								? "Subcommands"
								: "Arguments"}
						</p>
						<span class="text-[10px] text-muted-foreground"
							>{option.options.length}</span
						>
					</div>
					<div class="mt-3">
						<Self
							options={option.options}
							context={option.type === "subcommand_group"
								? "group"
								: "subcommand"}
							path={`${path} > ${option.name || "unnamed"}`}
							{onChange}
						/>
					</div>
				</div>
			{/if}
		</div>
	{/each}

	<div class="flex flex-wrap gap-2">
		{#if showArgument}
			<Button
				variant="outline"
				size="sm"
				class="gap-1.5"
				disabled={atLimit}
				onclick={() => addOption("text")}
			>
				<Plus class="size-3.5" />
				Add argument
			</Button>
		{/if}
		{#if showSubcommand}
			<Button
				variant="outline"
				size="sm"
				class="gap-1.5"
				disabled={atLimit}
				onclick={() => addOption("subcommand")}
			>
				<Plus class="size-3.5" />
				Add subcommand
			</Button>
		{/if}
		{#if showGroup}
			<Button
				variant="outline"
				size="sm"
				class="gap-1.5"
				disabled={atLimit}
				onclick={() => addOption("subcommand_group")}
			>
				<Plus class="size-3.5" />
				Add subcommand group
			</Button>
		{/if}
	</div>
</div>
