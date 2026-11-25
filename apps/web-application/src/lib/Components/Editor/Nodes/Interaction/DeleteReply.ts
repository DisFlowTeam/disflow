import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class DeleteReply extends BaseNode {
	static title = "Delete Reply";
	static category = "Interaction";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);
		this.addInput("Interaction", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 1);

		return `await ${interaction}.deleteReply();`;
	}
}
