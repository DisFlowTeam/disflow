import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class PinMessage extends BaseNode {
	static title = "Pin Message";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Message", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const message = generator.valueToCode(this, 1);

		return `await ${message}.pin();`;
	}
}
