import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrNumber } from "../helpers";

export class GetListItem extends BaseNode {
	static title = "Get List Item";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("List", FlowIOTypes.Array);
		this.addInput("Index", FlowIOTypes.Number);

		this.addProperty("index", 0, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Index",
			0,
			(value: number) => {
				this.properties.index = value;
			},
			{ property: "index" },
		);

		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const list =
			this.inputs[0].link == null ? "[]" : generator.valueToCode(this, 0);
		const index = inputOrNumber(generator, this, 1, "index");

		return `(${list} ?? [])[${index}]`;
	}
}
