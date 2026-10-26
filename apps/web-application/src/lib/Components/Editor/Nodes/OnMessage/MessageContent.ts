import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class MessageContent extends BaseNode {
	static title: string = "Message Content";
	static category: string = "Message";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.TextTools);
		this.addOutput("content", FlowIOTypes.String);
	}

	nodeToCode(): string {
		return `disflowMessage.content`;
	}
}
