import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrTextOrNull } from "../helpers";

const STATUSES = ["online", "idle", "dnd", "invisible"];
const ACTIVITY_TYPES = [
	"Playing",
	"Watching",
	"Listening",
	"Competing",
	"Custom",
];

/**
 * Sets the bot's presence. Leaving the activity name empty only changes the
 * status, which is handy for the main file before login.
 */
export class SetPresence extends BaseNode {
	static title = "Set Presence";
	static category = "Discord";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Discord);

		this.addInput("Activity Name", FlowIOTypes.String);

		this.addProperty("activity", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Activity Name",
			"",
			(value: string) => {
				this.properties.activity = value;
			},
			{ property: "activity" },
		);

		this.addProperty("status", "online", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Status",
			"online",
			(value: string) => {
				this.properties.status = value;
			},
			{ property: "status", values: STATUSES },
		);

		this.addProperty("type", "Playing", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Type",
			"Playing",
			(value: string) => {
				this.properties.type = value;
			},
			{ property: "type", values: ACTIVITY_TYPES },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const status = STATUSES.includes(String(this.properties.status))
			? String(this.properties.status)
			: "online";
		const type = ACTIVITY_TYPES.includes(String(this.properties.type))
			? String(this.properties.type)
			: "Playing";
		const activity = inputOrTextOrNull(generator, this, 1, "activity");
		const activities = activity
			? `, activities: [{ name: ${activity}, type: DisFlowDJS.ActivityType.${type} }]`
			: "";

		// The main file runs before login, where `client.user` is still null.
		// Apply immediately once ready, and defer until the ready event
		// otherwise so the same node works in both contexts.
		return `(() => {
	const disflowPresence = { status: ${JSON.stringify(status)}${activities} };
	if (disflowClient.user) {
		disflowClient.user.setPresence(disflowPresence);
		return;
	}
	disflowClient.once(DisFlowDJS.Events.ClientReady, () => disflowClient.user.setPresence(disflowPresence));
})();`;
	}
}
