import type {
	CommandOptionChannelType,
	CommandOptionType,
} from "@disflow-team/local-data";

export const COMMAND_OPTION_TYPES: {
	value: CommandOptionType;
	label: string;
	description: string;
}[] = [
	{
		value: "text",
		label: "Text",
		description: "A line of text",
	},
	{
		value: "integer",
		label: "Whole number",
		description: "A number without decimals",
	},
	{
		value: "number",
		label: "Decimal number",
		description: "A number that can have decimals",
	},
	{
		value: "boolean",
		label: "True / false",
		description: "A yes or no toggle",
	},
	{
		value: "user",
		label: "User",
		description: "A Discord user",
	},
	{
		value: "channel",
		label: "Channel",
		description: "A server channel",
	},
	{
		value: "role",
		label: "Role",
		description: "A server role",
	},
	{
		value: "mentionable",
		label: "User or role",
		description: "A user or role",
	},
	{
		value: "attachment",
		label: "File attachment",
		description: "An uploaded file",
	},
	{
		value: "subcommand",
		label: "Subcommand",
		description: "A named branch of the command",
	},
	{
		value: "subcommand_group",
		label: "Subcommand group",
		description: "A group of subcommands",
	},
];

export const COMMAND_CHANNEL_TYPES: {
	value: CommandOptionChannelType;
	label: string;
}[] = [
	{ value: "text", label: "Text" },
	{ value: "voice", label: "Voice" },
	{ value: "category", label: "Category" },
	{ value: "announcement", label: "Announcement" },
	{ value: "stage", label: "Stage" },
	{ value: "forum", label: "Forum" },
	{ value: "thread", label: "Thread" },
	{ value: "media", label: "Media" },
];

export const SIMPLE_OPTION_TYPES = COMMAND_OPTION_TYPES.filter(
	(entry) => !isContainerType(entry.value),
).map((entry) => entry.value);

export const CONTAINER_OPTION_TYPES: CommandOptionType[] = [
	"subcommand",
	"subcommand_group",
];

export function isContainerType(type: CommandOptionType) {
	return type === "subcommand" || type === "subcommand_group";
}

export function isChoiceType(type: CommandOptionType) {
	return type === "text" || type === "integer" || type === "number";
}

export function isNumericType(type: CommandOptionType) {
	return type === "integer" || type === "number";
}

export function optionTypeLabel(type: CommandOptionType) {
	return (
		COMMAND_OPTION_TYPES.find((entry) => entry.value === type)?.label ?? type
	);
}
