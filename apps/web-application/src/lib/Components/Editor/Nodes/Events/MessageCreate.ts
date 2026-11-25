import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnMessage extends DiscordEventRoot {
	static title = "On Message";
	static eventName = "MessageCreate";
	static payload = "disflowMessage";
	static requiredIntents = ["MessageContent", "GuildMessages"];
}
