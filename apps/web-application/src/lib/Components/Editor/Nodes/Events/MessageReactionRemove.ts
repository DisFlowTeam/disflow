import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageReactionRemove extends DiscordEventRoot {
	static title = "On Message Reaction Remove";
	static eventName = "MessageReactionRemove";
	static payload = "reaction, user";
	static requiredIntents = ["GuildMessages", "GuildMessageReactions"];
}
