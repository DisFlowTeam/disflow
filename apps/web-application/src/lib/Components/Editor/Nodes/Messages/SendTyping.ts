import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class SendTyping extends BaseNode {
	static title = "Send Typing";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Channel", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);

		return `await ${channel}.sendTyping();`;
	}
}
