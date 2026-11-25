import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageReactionAdd extends DiscordEventRoot {
	static title = "On Message Reaction Add";
	static eventName = "MessageReactionAdd";
	static payload = "reaction, user";
	static requiredIntents = ["GuildMessages", "GuildMessageReactions"];
}
