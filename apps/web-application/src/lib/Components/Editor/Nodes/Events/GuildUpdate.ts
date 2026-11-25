import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnGuildUpdate extends DiscordEventRoot {
	static title = "On Guild Update";
	static eventName = "GuildUpdate";
	static payload = "oldGuild, newGuild";
}
