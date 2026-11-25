import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class Message extends BaseNode {
	static title = "Message";
	static category = "Messages";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);
		this.addOutput("Message", FlowIOTypes.Object);
	}

	nodeToCode(): string {
		return "disflowMessage";
	}
}
