import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
	JavaScriptConstantStrings,
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
		// Exec is input/output 0, so "Times" and the "Run" body are at 1.
		const times =
			this.inputs[1].link == null
				? (this.properties.times ?? 1)
				: generator.valueToCode(this, 1);

		// statementToCode never returns an empty string, so compare against the
		// no-op marker: an empty loop would otherwise spin forever.
		const body = generator.statementToCode(this, 1);

		return `for(let i = 0; i < ${times}; i++) {\n${body === JavaScriptConstantStrings.NoOp ? "break" : body}\n}`;
	}
}
