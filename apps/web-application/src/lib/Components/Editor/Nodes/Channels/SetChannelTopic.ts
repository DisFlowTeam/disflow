import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, inputOrTextOrNull } from "../helpers";

export class SetChannelTopic extends BaseNode {
	static title = "Set Channel Topic";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Topic", FlowIOTypes.String);
		this.addInput("Reason", FlowIOTypes.String);

		this.addProperty("topic", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Topic",
			"",
			(value: string) => {
				this.properties.topic = value;
			},
			{ property: "topic" },
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
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const topic = inputOrText(generator, this, 2, "topic");
		const reason = inputOrTextOrNull(generator, this, 3, "reason");

		return `await ${channel}.setTopic(${topic}${reason ? `, ${reason}` : ""});`;
	}
}
