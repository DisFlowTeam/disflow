import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class DeferUpdate extends BaseNode {
	static title = "Defer Update";
	static category = "Interaction";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);
		this.addInput("Interaction", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 1);

		return `await ${interaction}.deferUpdate();`;
	}
}
