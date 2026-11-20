import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnGuildDelete extends DiscordEventRoot {
	static title = "On Guild Delete";
	static eventName = "GuildDelete";
	static payload = "guild";
}
