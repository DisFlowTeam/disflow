import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class RandomNumber extends BaseNode {
	static title: string = "Random Number";
	static category: string = "Maths";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Maths);
		this.addInput("From", FlowIOTypes.Number);
		this.addInput("To", FlowIOTypes.Number);

		this.addProperty("from", 1, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"From",
			1,
			(v) => {
				this.properties.from = v;
			},
			{
				property: "from",
			},
		);

		this.addProperty("to", 100, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"To",
			100,
			(v) => {
				this.properties.to = v;
			},
			{
				property: "to",
			},
		);

		this.addOutput("Number", FlowIOTypes.Number);
	}

	nodeToCode(generator: BaseGenerator): string {
		const min =
			this.inputs[0].link == null
				? this.properties.from
				: generator.valueToCode(this, 0);

		const max =
			this.inputs[1].link == null
				? this.properties.to
				: generator.valueToCode(this, 1);

		return `(Math.random() * (${max} - ${min}) + ${min})`;
	}
}
