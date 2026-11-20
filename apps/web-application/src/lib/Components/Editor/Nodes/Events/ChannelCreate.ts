import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnChannelCreate extends DiscordEventRoot {
	static title = "On Channel Create";
	static eventName = "ChannelCreate";
	static payload = "channel";
}
