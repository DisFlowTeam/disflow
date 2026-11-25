import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class MessageAuthor extends BaseNode {
	static title: string = "Message Author";
	static category: string = "Messages";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);
		this.addOutput("author", FlowIOTypes.Object);
	}

	nodeToCode(): string {
		return `disflowMessage.author`;
	}
}
