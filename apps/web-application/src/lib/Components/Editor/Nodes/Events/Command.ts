import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnCommand extends DiscordEventRoot {
	static title = "On Command";
	static eventName = "InteractionCreate";
	static payload = "disflowCtx";
}
