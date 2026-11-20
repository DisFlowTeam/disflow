import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnUserUpdate extends DiscordEventRoot {
	static title = "On User Update";
	static eventName = "UserUpdate";
	static payload = "oldUser, newUser";
	static requiredIntents = ["GuildMembers"];
}
