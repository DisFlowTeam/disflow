import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, jsonOrNull } from "../helpers";

const TYPES = {
	Public: "PublicThread",
	Private: "PrivateThread",
} as const;

/**
 * Creates a thread on a text or forum channel. Discord only accepts the
 * archive durations 60, 1440, 4320 and 10080 minutes.
 */
export class CreateThread extends BaseNode {
	static title = "Create Thread";
	static category = "Channels";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Name", FlowIOTypes.String);

		this.addProperty("name", "new-thread", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"new-thread",
			(value: string) => {
				this.properties.name = value;
			},
			{ property: "name" },
		);

		this.addProperty("type", "Public", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Type",
			"Public",
			(value: string) => {
				this.properties.type = value;
			},
			{ property: "type", values: Object.keys(TYPES) },
		);

		this.addProperty("autoArchiveDuration", 1440, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Auto Archive (minutes)",
			1440,
			(value: number) => {
				this.properties.autoArchiveDuration = value;
			},
			{ property: "autoArchiveDuration" },
		);

		this.addProperty("reason", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Reason",
			"",
			(value: string) => {
				this.properties.reason = value;
			},
			{ property: "reason" },
		);

		this.addOutput("Thread", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");
		const type =
			TYPES[this.properties.type as keyof typeof TYPES] ?? "PublicThread";
		const archive = Number(this.properties.autoArchiveDuration) || 1440;
		const reason = jsonOrNull(this.properties.reason);

		return `await ${channel}.threads.create({ name: ${name}, type: DisFlowDJS.ChannelType.${type}, autoArchiveDuration: ${archive}${reason ? `, reason: ${reason}` : ""} })`;
	}
}
