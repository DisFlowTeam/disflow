import * as EventRoots from "../Components/Editor/Nodes/Events";
import type {
	EventRootClass,
	NodeClass,
} from "../Components/Editor/Nodes/types";
import { DEFAULT_NODES } from "./DefaultNodes";
import { INTERACTION_NODES } from "./InteractionNodes";
import { CHANNEL_NODES } from "./OnChannel";
import { GUILD_NODES } from "./OnGuild";
import { MEMBER_NODES } from "./OnMember";
import { MESSAGE_ACTION_NODES, MESSAGE_NODES } from "./OnMessage";
import { PRESENCE_NODES } from "./OnPresence";
import { REACTION_NODES } from "./OnReaction";
import { TYPING_NODES } from "./OnTyping";
import { USER_NODES } from "./OnUser";
import { VOICE_NODES } from "./OnVoice";

export interface SupportedEvent {
	name: string;
	root: EventRootClass;
	nodes: NodeClass[];
	generatorTemplate: string;
	intentsRequired?: string[];
	warn?: string;
}

export const SUPPORTED_EVENTS: SupportedEvent[] = [
	{
		name: "Ready",
		root: EventRoots.OnConnect,
		nodes: [...DEFAULT_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ClientReady, async () => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
	},
	{
		name: "Message",
		root: EventRoots.OnMessage,
		nodes: [...DEFAULT_NODES, ...MESSAGE_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageCreate, async (disflowMessage) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Create",
		root: EventRoots.OnGuildCreate,
		nodes: [...DEFAULT_NODES, ...GUILD_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildCreate, async (guild) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Delete",
		root: EventRoots.OnGuildDelete,
		nodes: [...DEFAULT_NODES, ...GUILD_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildDelete, async (guild) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Update",
		root: EventRoots.OnGuildUpdate,
		nodes: [...DEFAULT_NODES, ...GUILD_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildUpdate, async (oldGuild, newGuild) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Member Add",
		root: EventRoots.OnGuildMemberAdd,
		nodes: [...DEFAULT_NODES, ...MEMBER_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildMemberAdd, async (member) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Member Remove",
		root: EventRoots.OnGuildMemberRemove,
		nodes: [...DEFAULT_NODES, ...MEMBER_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildMemberRemove, async (member) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Guild Member Update",
		root: EventRoots.OnGuildMemberUpdate,
		nodes: [...DEFAULT_NODES, ...MEMBER_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.GuildMemberUpdate, async (oldMember, newMember) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Create",
		root: EventRoots.OnChannelCreate,
		nodes: [...DEFAULT_NODES, ...CHANNEL_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelCreate, async (channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Delete",
		root: EventRoots.OnChannelDelete,
		nodes: [...DEFAULT_NODES, ...CHANNEL_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelDelete, async (channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Update",
		root: EventRoots.OnChannelUpdate,
		nodes: [...DEFAULT_NODES, ...CHANNEL_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelUpdate, async (oldChannel, newChannel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Channel Pins Update",
		root: EventRoots.OnChannelPinsUpdate,
		nodes: [...DEFAULT_NODES, ...CHANNEL_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.ChannelPinsUpdate, async (channel, date) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["Guilds"],
		warn: 'This event requires the "Guilds" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Interaction Create",
		root: EventRoots.OnInteraction,
		nodes: [...DEFAULT_NODES, ...INTERACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.InteractionCreate, async (disflowCtx) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
	},
	{
		name: "Message Delete",
		root: EventRoots.OnMessageDelete,
		nodes: [...DEFAULT_NODES, ...MESSAGE_ACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageDelete, async (message) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Add",
		root: EventRoots.OnMessageReactionAdd,
		nodes: [...DEFAULT_NODES, ...REACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionAdd, async (reaction, user) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Remove",
		root: EventRoots.OnMessageReactionRemove,
		nodes: [...DEFAULT_NODES, ...REACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionRemove, async (reaction, user) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Remove All",
		root: EventRoots.OnMessageReactionRemoveAll,
		nodes: [...DEFAULT_NODES, ...REACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionRemoveAll, async (message, reactions) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Reaction Remove Emoji",
		root: EventRoots.OnMessageReactionRemoveEmoji,
		nodes: [...DEFAULT_NODES, ...REACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageReactionRemoveEmoji, async (reaction) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "GuildMessageReactions"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Update",
		root: EventRoots.OnMessageUpdate,
		nodes: [...DEFAULT_NODES, ...MESSAGE_ACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageUpdate, async (oldMessage, newMessage) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Message Delete Bulk",
		root: EventRoots.OnMessageBulkDelete,
		nodes: [...DEFAULT_NODES, ...MESSAGE_ACTION_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageBulkDelete, async (messages, channel) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessages", "MessageContent"],
		warn: 'This event requires the "Message Content" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Voice State Update",
		root: EventRoots.OnVoiceStateUpdate,
		nodes: [...DEFAULT_NODES, ...VOICE_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.VoiceStateUpdate, async (oldState, newState) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildVoiceStates"],
		warn: 'This event requires the "Guild Voice States" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Presence Update",
		root: EventRoots.OnPresenceUpdate,
		nodes: [...DEFAULT_NODES, ...PRESENCE_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.PresenceUpdate, async (oldPresence, newPresence) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildPresences"],
		warn: 'This event requires the "Guild Presences" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "Typing Start",
		root: EventRoots.OnTypingStart,
		nodes: [...DEFAULT_NODES, ...TYPING_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.TypingStart, async (typing) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMessageTyping"],
		warn: 'This event requires the "Guild Message Typing" intent to be toggled in the Discord Developer Portal.',
	},
	{
		name: "User Update",
		root: EventRoots.OnUserUpdate,
		nodes: [...DEFAULT_NODES, ...USER_NODES],
		generatorTemplate: `disflowClient.on(DisflowDJS.Events.UserUpdate, async (oldUser, newUser) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
		intentsRequired: ["GuildMembers"],
		warn: 'This event requires the "Guild Members" intent to be toggled in the Discord Developer Portal.',
	},
];
