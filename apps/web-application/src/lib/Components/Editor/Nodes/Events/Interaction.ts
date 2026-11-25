import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnInteraction extends DiscordEventRoot {
	static title = "On Interaction";
	static eventName = "InteractionCreate";
	static payload = "disflowCtx";
}
