import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnGuildCreate extends DiscordEventRoot {
	static title = "On Guild Create";
	static eventName = "GuildCreate";
	static payload = "guild";
}
