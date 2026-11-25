import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class SendEmbed extends BaseNode {
	static title = "Send Embed";
	static category = "Embeds";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Embeds);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Embed", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const embed = generator.valueToCode(this, 2);

		return `await ${channel}.send({ embeds: [${embed}] });`;
	}
}
