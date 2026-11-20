import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class DeferReply extends BaseNode {
	static title = "Defer Reply";
	static category = "Interaction";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
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

		if (this.properties.ephemeral) {
			return `await ${interaction}.deferReply({ flags: DisFlowDJS.MessageFlags.Ephemeral });`;
		}

		return `await ${interaction}.deferReply();`;
	}
}
