import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class EditMessage extends BaseNode {
	static title = "Edit Message";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Message", FlowIOTypes.Object);
		this.addInput("Content", FlowIOTypes.Any);
		this.addProperty("content", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Content",
			"",
			(value: string) => {
				this.properties.content = value;
			},
			{
				property: "content",
			},
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const message = generator.valueToCode(this, 1);
		const content = inputOrText(generator, this, 2, "content");

		return `await ${message}.edit(${content});`;
	}
}
