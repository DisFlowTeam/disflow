import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnGuildMemberRemove extends DiscordEventRoot {
	static title = "On Guild Member Remove";
	static eventName = "GuildMemberRemove";
	static payload = "member";
	static requiredIntents = ["GuildMembers"];
}
