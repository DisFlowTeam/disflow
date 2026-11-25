import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageUpdate extends DiscordEventRoot {
	static title = "On Message Update";
	static eventName = "MessageUpdate";
	static payload = "oldMessage, newMessage";
	static requiredIntents = ["GuildMessages", "MessageContent"];
}
