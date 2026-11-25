import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class NewLine extends BaseNode {
	static title: string = "New Line";
	static category: string = "Text Tools";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.TextTools);
		this.addOutput("Text", FlowIOTypes.String);
	}

	nodeToCode(): string {
		return `"\\n"`;
	}
}
