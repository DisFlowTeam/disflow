import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const controls = {
	let: "let",
	const: "const",
	var: "var",
};

export class CreateVariable extends BaseNode {
	static title: string = "Create Variable";
	static category: string = "Variables";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Variables);
		this.addInput("Value", FlowIOTypes.Any);

		this.addProperty("name", "myVariable", FlowIOTypes.String);
		this.addProperty("keyword", "let", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Keyword",
			"let",
			(value) => {
				this.properties.keyword = value;
			},
			{
				values: Object.keys(controls),
				property: "keyword",
			},
		);
		this.addWidget(
			"text",
			"Name",
			"myVariable",
			(v: string) => {
				// if(v.trim() === "") this.addInput("name", FlowIOTypes.String);

				this.properties.name = v;
			},
			{
				property: "name",
			},
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const keyword = controls[this.properties.keyword as keyof typeof controls];
		const name = this.properties.name || "myVariable";
		const valueInput = this.inputs[1];
		const hasValue = valueInput?.link != null;

		if (keyword === "const" && !hasValue) {
			return `const ${name} = undefined;`;
		}

		if (hasValue) {
			return `${keyword} ${name} = ${generator.valueToCode(this, 1)};`;
		}

		return `${keyword} ${name};`;
	}
}
