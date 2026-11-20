import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnGuildMemberAdd extends DiscordEventRoot {
	static title = "On Guild Member Add";
	static eventName = "GuildMemberAdd";
	static payload = "member";
	static requiredIntents = ["GuildMembers"];
}
