import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnGuildMemberUpdate extends DiscordEventRoot {
	static title = "On Guild Member Update";
	static eventName = "GuildMemberUpdate";
	static payload = "oldMember, newMember";
	static requiredIntents = ["GuildMembers"];
}
