import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnTypingStart extends DiscordEventRoot {
	static title = "On Typing Start";
	static eventName = "TypingStart";
	static payload = "typing";
	static requiredIntents = ["GuildMessageTyping"];
}
