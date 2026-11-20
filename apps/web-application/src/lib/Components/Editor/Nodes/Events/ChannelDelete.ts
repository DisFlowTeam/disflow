import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnChannelDelete extends DiscordEventRoot {
	static title = "On Channel Delete";
	static eventName = "ChannelDelete";
	static payload = "channel";
}
