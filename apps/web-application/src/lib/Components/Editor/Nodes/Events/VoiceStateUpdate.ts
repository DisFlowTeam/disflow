import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnVoiceStateUpdate extends DiscordEventRoot {
	static title = "On Voice State Update";
	static eventName = "VoiceStateUpdate";
	static payload = "oldState, newState";
	static requiredIntents = ["GuildVoiceStates"];
}
