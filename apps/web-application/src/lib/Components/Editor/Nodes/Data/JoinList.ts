import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class JoinList extends BaseNode {
	static title = "Join List";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("List", FlowIOTypes.Array);
		this.addInput("Separator", FlowIOTypes.String);

		this.addProperty("separator", ", ", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Separator",
			", ",
			(value: string) => {
				this.properties.separator = value;
			},
			{ property: "separator" },
		);

		this.addOutput("Text", FlowIOTypes.String);
	}

	nodeToCode(generator: BaseGenerator): string {
		const list =
			this.inputs[0].link == null ? "[]" : generator.valueToCode(this, 0);
		const separator = inputOrText(generator, this, 1, "separator");

		return `(${list} ?? []).join(${separator})`;
	}
}
