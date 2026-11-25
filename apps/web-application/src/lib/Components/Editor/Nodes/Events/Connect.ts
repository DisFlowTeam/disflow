import { DiscordEventRoot } from "./DiscordEventRoot";

export class OnConnect extends DiscordEventRoot {
	static title = "On Connect";
	static eventName = "ClientReady";
	static payload = "";
}
