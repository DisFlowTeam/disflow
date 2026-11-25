import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnPresenceUpdate extends DiscordEventRoot {
	static title = "On Presence Update";
	static eventName = "PresenceUpdate";
	static payload = "oldPresence, newPresence";
	static requiredIntents = ["GuildPresences"];
}
