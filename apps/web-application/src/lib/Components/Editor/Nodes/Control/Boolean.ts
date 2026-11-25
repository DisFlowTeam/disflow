import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class BooleanNode extends BaseNode {
	static title: string = "Boolean";
	static category: string = "Control";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);
		this.addProperty("value", "true", FlowIOTypes.Number);
		this.addWidget(
			"combo",
			"Value",
			"true",
			(v) => {
				this.properties.value = v;
			},
			{
				property: "value",
				values: ["true", "false"],
			},
		);
		this.addOutput("Boolean", FlowIOTypes.Boolean);
	}

	nodeToCode(): string {
		return `${this.properties.value || "true"}`;
	}
}
