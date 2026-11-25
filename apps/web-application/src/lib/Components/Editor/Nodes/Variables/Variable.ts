import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { toIdentifier } from "../helpers";

export class Variable extends BaseNode {
	static title: string = "Variable";
	static category: string = "Variables";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Variables);
		this.addProperty("name", "myVariable", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"myVariable",
			(v) => {
				this.properties.name = v;
			},
			{
				property: "name",
				sanitize: toIdentifier,
				sanitizeLabel: "Variable name",
			},
		);
		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(): string {
		return toIdentifier(this.properties.name);
	}
}
