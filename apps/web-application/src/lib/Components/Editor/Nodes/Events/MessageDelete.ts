import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessageDelete extends DiscordEventRoot {
	static title = "On Message Delete";
	static eventName = "MessageDelete";
	static payload = "message";
	static requiredIntents = ["GuildMessages", "MessageContent"];
}
