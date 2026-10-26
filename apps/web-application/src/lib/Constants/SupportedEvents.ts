import type { BaseNode } from "@disflow-team/code-gen";
import { DEFAULT_NODES } from "./DefaultNodes";
import { MESSAGE_NODES } from "./OnMessage";

export interface SupportedEvent {
	name: string;
	nodes: (typeof BaseNode)[];
	generatorTemplate: string;
	intentsRequired?: string[];
	warn?: string;
}

export const SUPPORTED_EVENTS: SupportedEvent[] = [
	{
		name: "Ready",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.Ready, async () => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
	},
	{
		name: "Message",
		// TODO: Add message nodes once they are implemented
		nodes: [...DEFAULT_NODES, ...MESSAGE_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageCreate, async (message) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Create",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildCreate, async (guild) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Delete",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildDelete, async (guild) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildUpdate, async (guild) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Member Add",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildMemberAdd, async (member) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Member Remove",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildMemberRemove, async (member) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Member Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildMemberUpdate, async (member) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Create",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelCreate, async (channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Delete",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelDelete, async (channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelUpdate, async (channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Pins Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelPinsUpdate, async (channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Interaction Create",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.InteractionCreate, async (interaction) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
	},
	{
		name: "Message Delete",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageDelete, async (message) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Add",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionAdd, async (reaction) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Remove",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionRemove, async (reaction) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Remove All",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionRemoveAll, async (reaction) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Remove Emoji",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionRemoveEmoji, async (reaction) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageUpdate, async (message) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Delete Bulk",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageDeleteBulk, async (messages) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Voice State Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.VoiceStateUpdate, async (state) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildVoiceStates"],
		warn: 'This event requires the "Guild Voice States" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Presence Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.PresenceUpdate, async (presence) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildPresences"],
		warn: 'This event requires the "Guild Presences" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Typing Start",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.TypingStart, async (user) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "User Add",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.UserAdd, async (user) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "User Remove",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.UserRemove, async (user) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "User Update",
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.UserUpdate, async (user) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
];