import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageReactionRemoveEmoji extends DiscordEventRoot {
	static title = "On Message Reaction Remove Emoji";
	static eventName = "MessageReactionRemoveEmoji";
	static payload = "reaction";
	static requiredIntents = ["GuildMessages", "GuildMessageReactions"];
}
