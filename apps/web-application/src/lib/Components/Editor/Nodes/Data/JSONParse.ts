import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class JSONParse extends BaseNode {
	static title = "JSON Parse";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("Text", FlowIOTypes.String);

		this.addProperty("text", "{}", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Text",
			"{}",
			(value: string) => {
				this.properties.text = value;
			},
			{ property: "text" },
		);

		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const text = inputOrText(generator, this, 0, "text");

		return `JSON.parse(${text})`;
	}
}
