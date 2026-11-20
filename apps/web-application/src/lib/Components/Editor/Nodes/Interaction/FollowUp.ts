import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class FollowUp extends BaseNode {
	static title = "Follow Up";
	static category = "Interaction";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
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

		this.addProperty("ephemeral", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Ephemeral",
			false,
			(value: boolean) => {
				this.properties.ephemeral = value;
			},
			{
				property: "ephemeral",
			},
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 1);
		const content = inputOrText(generator, this, 2, "content");

		if (this.properties.ephemeral) {
			return `await ${interaction}.followUp({ content: ${content}, flags: DisFlowDJS.MessageFlags.Ephemeral });`;
		}

		return `await ${interaction}.followUp(${content});`;
	}
}
