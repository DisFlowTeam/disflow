import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class RepeatNode extends BaseNode {
	static title: string = "Repeat";
	static category: string = "Control";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);
		this.addInput("Times", FlowIOTypes.Number);
		this.addOutput("Run", FlowIOTypes.Flow);

		this.addProperty("times", 1, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"times",
			1,
			(value: number) => {
				this.properties.times = value;
			},
			{
				property: "times",
			},
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const times = generator.valueToCode(this, 0);

		return `for(let i = 0; i < ${times || this.properties.times || 1}; i++) {\n${generator.statementToCode(this, 0) || "break"}\n}`;
	}
}
