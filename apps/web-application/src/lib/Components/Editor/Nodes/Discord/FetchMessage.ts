import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class FetchMessage extends BaseNode {
	static title = "Fetch Message";
	static category = "Discord";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Discord);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Message ID", FlowIOTypes.String);

		this.addProperty("messageId", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Message ID",
			"",
			(value: string) => {
				this.properties.messageId = value;
			},
			{ property: "messageId" },
		);

		this.addOutput("Message", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 0);
		const messageId = inputOrText(generator, this, 1, "messageId");

		return `await ${channel}.messages.fetch(${messageId})`;
	}
}
