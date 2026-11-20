import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageReactionRemoveAll extends DiscordEventRoot {
	static title = "On Message Reaction Remove All";
	static eventName = "MessageReactionRemoveAll";
	static payload = "message, reactions";
	static requiredIntents = ["GuildMessages", "GuildMessageReactions"];
}
