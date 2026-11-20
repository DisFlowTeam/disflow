import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageBulkDelete extends DiscordEventRoot {
	static title = "On Message Bulk Delete";
	static eventName = "MessageBulkDelete";
	static payload = "messages, channel";
	static requiredIntents = ["GuildMessages", "MessageContent"];
}
