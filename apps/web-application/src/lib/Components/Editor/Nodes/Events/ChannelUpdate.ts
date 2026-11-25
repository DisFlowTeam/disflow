import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnChannelUpdate extends DiscordEventRoot {
	static title = "On Channel Update";
	static eventName = "ChannelUpdate";
	static payload = "oldChannel, newChannel";
}
