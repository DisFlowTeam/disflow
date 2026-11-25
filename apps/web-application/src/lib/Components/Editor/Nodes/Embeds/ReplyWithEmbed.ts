import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class ReplyWithEmbed extends BaseNode {
	static title = "Reply With Embed";
	static category = "Embeds";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Embeds);

		this.addInput("Message", FlowIOTypes.Object);
		this.addInput("Embed", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const message = generator.valueToCode(this, 1);
		const embed = generator.valueToCode(this, 2);

		return `await ${message}.reply({ embeds: [${embed}] });`;
	}
}
