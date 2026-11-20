<script lang="ts">
import type { Application, CommandOption } from "@disflow-team/local-data";
import { onMount } from "svelte";
import CommandOptionList from "$lib/Components/Commands/CommandOptionList.svelte";
import { Button } from "$lib/Components/ui/button";
import * as Dialog from "$lib/Components/ui/dialog";
import {
	isChoiceType,
	isContainerType,
	isNumericType,
} from "$lib/Constants/CommandOptions";

let {
	app,
	command,
	dialogOpen = $bindable(false),
	onSaved,
}: {
	app: Application;
	command: {
		name: string;
		description: string;
		options: CommandOption[];
	};
	dialogOpen?: boolean;
	onSaved: () => void;
} = $props();

type Context = "command" | "group" | "subcommand";

function cloneOptions(options: CommandOption[]): CommandOption[] {
	return options.map((option) => ({
		...option,
		choices: option.choices?.map((choice) => ({ ...choice })),
		channelTypes: option.channelTypes ? [...option.channelTypes] : undefined,
		options: isContainerType(option.type)
			? cloneOptions(option.options ?? [])
			: undefined,
	}));
}

function sortOptions(options: CommandOption[]): CommandOption[] {
	return [...options]
		.sort((a, b) => {
			if (isContainerType(a.type) || isContainerType(b.type)) return 0;
			return Number(b.required ?? false) - Number(a.required ?? false);
		})
		.map((option) => ({
			...option,
			options: option.options ? sortOptions(option.options) : undefined,
		}));
}

let options = $state<CommandOption[]>([]);
let error = $state<string | null>(null);
let saving = $state(false);

onMount(() => {
	options = cloneOptions(command.options ?? []);
});

function validateSimpleOption(option: CommandOption, path: string) {
	if (isChoiceType(option.type)) {
		const choices = option.choices ?? [];

		if (option.autocomplete && choices.length > 0) {
			return `"${path}" can't use both choices and autocomplete.`;
		}

		if (choices.length > 25) {
			return `"${path}" can have at most 25 choices.`;
		}

		const choiceNames = new Set<string>();
		const choiceValues = new Set<string>();

		for (const choice of choices) {
			const choiceName = choice.name.trim();
			const choiceValue = choice.value.trim();

			if (!choiceName) {
				return `Every choice on "${path}" needs a label.`;
			}

			if (!choiceValue) {
				return `Every choice on "${path}" needs a value.`;
			}

			if (choiceName.length > 100) {
				return `Choice labels on "${path}" must be 100 characters or fewer.`;
			}

			if (option.type === "text" && choiceValue.length > 100) {
				return `Choice values on "${path}" must be 100 characters or fewer.`;
			}

			if (choiceNames.has(choiceName)) {
				return `Choice labels on "${path}" must be unique.`;
			}
			choiceNames.add(choiceName);

			if (choiceValues.has(choiceValue)) {
				return `Choice values on "${path}" must be unique.`;
			}
			choiceValues.add(choiceValue);

			if (
				isNumericType(option.type) &&
				!Number.isFinite(Number(choiceValue))
			) {
				return `Choice values on "${path}" must be numbers.`;
			}
		}
	}

	if (option.type === "text") {
		if (
			option.minLength !== undefined &&
			(!Number.isInteger(option.minLength) ||
				option.minLength < 0 ||
				option.minLength > 6000)
		) {
			return `Minimum length on "${path}" must be between 0 and 6000.`;
		}

		if (
			option.maxLength !== undefined &&
			(!Number.isInteger(option.maxLength) ||
				option.maxLength < 1 ||
				option.maxLength > 6000)
		) {
			return `Maximum length on "${path}" must be between 1 and 6000.`;
		}

		if (
			option.minLength !== undefined &&
			option.maxLength !== undefined &&
			option.minLength > option.maxLength
		) {
			return `Minimum length can't be greater than maximum length on "${path}".`;
		}
	}

	if (isNumericType(option.type)) {
		if (
			option.type === "integer" &&
			option.minValue !== undefined &&
			!Number.isInteger(option.minValue)
		) {
			return `Minimum value on "${path}" must be a whole number.`;
		}

		if (
			option.type === "integer" &&
			option.maxValue !== undefined &&
			!Number.isInteger(option.maxValue)
		) {
			return `Maximum value on "${path}" must be a whole number.`;
		}

		if (
			option.minValue !== undefined &&
			option.maxValue !== undefined &&
			option.minValue > option.maxValue
		) {
			return `Minimum value can't be greater than maximum value on "${path}".`;
		}
	}

	return null;
}

function validateList(
	list: CommandOption[],
	depth: number,
	context: Context,
	path: string,
): string | null {
	if (list.length > 25) {
		return `Each command level can have at most 25 options (${path}).`;
	}

	const names = new Set<string>();
	const hasContainers = list.some((option) => isContainerType(option.type));
	const hasSimple = list.some((option) => !isContainerType(option.type));

	if (context === "command" && hasContainers && hasSimple) {
		return "A command can't mix arguments and subcommands.";
	}

	if (
		context === "group" &&
		list.some((option) => option.type !== "subcommand")
	) {
		return `A subcommand group can only contain subcommands (${path}).`;
	}

	if (context === "subcommand" && hasContainers) {
		return `A subcommand can only contain arguments (${path}).`;
	}

	for (const option of list) {
		const optionPath = `${path} > ${option.name || "(unnamed)"}`;

		if (!/^[a-z0-9_-]{1,32}$/.test(option.name)) {
			return "Option names must be 1-32 lowercase letters, numbers, hyphens or underscores.";
		}

		if (names.has(option.name)) {
			return `Option "${option.name}" appears more than once at the same level.`;
		}
		names.add(option.name);

		if (!option.description.trim()) {
			return `Add a description for "${optionPath}".`;
		}

		if (option.description.length > 100) {
			return "Descriptions must be 100 characters or fewer.";
		}

		if (isContainerType(option.type)) {
			if (option.type === "subcommand_group" && depth !== 0) {
				return `Subcommand groups can only be added at the top level (${optionPath}).`;
			}

			if (option.type === "subcommand" && depth > 1) {
				return `Subcommands can't be nested this deep (${optionPath}).`;
			}

			const children = option.options ?? [];

			if (option.type === "subcommand_group" && children.length === 0) {
				return `Subcommand group "${option.name}" needs at least one subcommand.`;
			}

			const childError = validateList(
				children,
				depth + 1,
				option.type === "subcommand_group" ? "group" : "subcommand",
				optionPath,
			);

			if (childError) return childError;
		} else {
			const simpleError = validateSimpleOption(option, optionPath);
			if (simpleError) return simpleError;
		}
	}

	return null;
}

async function save() {
	const problem = validateList(options, 0, "command", `/${command.name}`);

	if (problem) {
		error = problem;
		return;
	}

	saving = true;
	error = null;

	try {
		await app.updateCommandOptions(
			command.name,
			$state.snapshot(sortOptions(options)) as CommandOption[],
		);
		dialogOpen = false;
		onSaved();
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Unable to save command options.";
	} finally {
		saving = false;
	}
}
</script>

<Dialog.Root
	bind:open={dialogOpen}
	onOpenChange={(next) => {
		if (!next) error = null;
	}}
>
	<Dialog.Content class="sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-lg">Command options</Dialog.Title>
			<Dialog.Description>
				Define arguments, subcommands or subcommand groups for
				<code class="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px]"
					>/{command.name}</code
				>.
			</Dialog.Description>
		</Dialog.Header>

		<div class="-mx-2 max-h-[55vh] overflow-y-auto px-2">
			<CommandOptionList
				options={options}
				context="command"
				path={`/${command.name}`}
				onChange={() => (error = null)}
			/>
		</div>

		{#if error}
			<p
				class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
			>
				{error}
			</p>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>
				Cancel
			</Button>
			<Button
				class="bg-blue-600 text-white hover:bg-blue-500"
				disabled={saving}
				onclick={save}
			>
				{saving ? "Saving…" : "Save options"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
