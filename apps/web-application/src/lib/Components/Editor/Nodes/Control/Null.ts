import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class Null extends BaseNode {
	static title: string = "Null";
	static category: string = "Control";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);
		this.addOutput("Null", FlowIOTypes.Any);
	}

	nodeToCode(): string {
		return `null`;
	}
}
