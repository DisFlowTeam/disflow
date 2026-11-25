import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class AddReaction extends BaseNode {
	static title = "Add Reaction";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Message", FlowIOTypes.Object);
		this.addInput("Emoji", FlowIOTypes.String);
		this.addProperty("emoji", "👍", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Emoji",
			"👍",
			(value: string) => {
				this.properties.emoji = value;
			},
			{
				property: "emoji",
			},
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const message = generator.valueToCode(this, 1);
		const emoji = inputOrText(generator, this, 2, "emoji");

		return `await ${message}.react(${emoji});`;
	}
}
