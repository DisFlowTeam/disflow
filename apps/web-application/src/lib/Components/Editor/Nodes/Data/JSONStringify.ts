import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class JSONStringify extends BaseNode {
	static title = "JSON Stringify";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("Value", FlowIOTypes.Any);

		this.addProperty("pretty", true, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Pretty",
			true,
			(value: boolean) => {
				this.properties.pretty = value;
			},
			{ property: "pretty" },
		);

		this.addOutput("Text", FlowIOTypes.String);
	}

	nodeToCode(generator: BaseGenerator): string {
		const value =
			this.inputs[0].link == null
				? "undefined"
				: generator.valueToCode(this, 0);

		return this.properties.pretty
			? `JSON.stringify(${value}, null, 2)`
			: `JSON.stringify(${value})`;
	}
}
