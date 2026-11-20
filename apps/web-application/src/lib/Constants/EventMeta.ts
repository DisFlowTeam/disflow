import MessageSquare from "@lucide/svelte/icons/message-square";
import Mic from "@lucide/svelte/icons/mic";
import Server from "@lucide/svelte/icons/server";
import SmilePlus from "@lucide/svelte/icons/smile-plus";
import Users from "@lucide/svelte/icons/users";
import Zap from "@lucide/svelte/icons/zap";
import type { Component } from "svelte";

export type EventGroup =
	| "Essentials"
	| "Messages"
	| "Guilds"
	| "Members"
	| "Reactions"
	| "Voice & Presence";

export const GROUP_ORDER: EventGroup[] = [
	"Essentials",
	"Messages",
	"Guilds",
	"Members",
	"Reactions",
	"Voice & Presence",
];

export const GROUP_ICONS: Record<EventGroup, Component> = {
	Essentials: Zap,
	Messages: MessageSquare,
	Guilds: Server,
	Members: Users,
	Reactions: SmilePlus,
	"Voice & Presence": Mic,
};

export const EVENT_META: Record<
	string,
	{ group: EventGroup; description: string }
> = {
	Ready: {
		group: "Essentials",
		description:
			"Runs once when the bot has connected and is ready to receive events.",
	},
	"Interaction Create": {
		group: "Essentials",
		description:
			"Runs when a user invokes a slash command or interacts with a component.",
	},
	Message: {
		group: "Messages",
		description: "Runs for every new message the bot can see in a server.",
	},
	"Message Update": {
		group: "Messages",
		description: "Runs when a message's content or embeds are edited.",
	},
	"Message Delete": {
		group: "Messages",
		description: "Runs when a single message is deleted.",
	},
	"Message Delete Bulk": {
		group: "Messages",
		description:
			"Runs when messages are deleted in bulk, such as during a purge.",
	},
	"Typing Start": {
		group: "Messages",
		description: "Runs when a user starts typing in a channel.",
	},
	"Guild Create": {
		group: "Guilds",
		description: "Runs when the bot joins a new server.",
	},
	"Guild Delete": {
		group: "Guilds",
		description:
			"Runs when the bot is removed from a server or a server is deleted.",
	},
	"Guild Update": {
		group: "Guilds",
		description:
			"Runs when a server's settings, name, icon or other properties change.",
	},
	"Channel Create": {
		group: "Guilds",
		description: "Runs when a channel is created in a server.",
	},
	"Channel Delete": {
		group: "Guilds",
		description: "Runs when a channel is deleted.",
	},
	"Channel Update": {
		group: "Guilds",
		description:
			"Runs when a channel's name, topic, permissions or settings change.",
	},
	"Channel Pins Update": {
		group: "Guilds",
		description: "Runs when a message is pinned or unpinned in a channel.",
	},
	"Guild Member Add": {
		group: "Members",
		description: "Runs when a user joins a server.",
	},
	"Guild Member Remove": {
		group: "Members",
		description: "Runs when a user leaves or is removed from a server.",
	},
	"Guild Member Update": {
		group: "Members",
		description: "Runs when a member's roles, nickname or profile changes.",
	},
	"User Update": {
		group: "Members",
		description: "Runs when a user's profile information changes.",
	},
	"Message Reaction Add": {
		group: "Reactions",
		description: "Runs when a reaction is added to a message.",
	},
	"Message Reaction Remove": {
		group: "Reactions",
		description: "Runs when a reaction is removed from a message.",
	},
	"Message Reaction Remove All": {
		group: "Reactions",
		description: "Runs when all reactions are removed from a message.",
	},
	"Message Reaction Remove Emoji": {
		group: "Reactions",
		description: "Runs when a single emoji reaction is removed from a message.",
	},
	"Voice State Update": {
		group: "Voice & Presence",
		description: "Runs when a user joins, leaves or changes their voice state.",
	},
	"Presence Update": {
		group: "Voice & Presence",
		description: "Runs when a member's online status or activity changes.",
	},
};
