import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnChannelPinsUpdate extends DiscordEventRoot {
	static title = "On Channel Pins Update";
	static eventName = "ChannelPinsUpdate";
	static payload = "channel, date";
}
