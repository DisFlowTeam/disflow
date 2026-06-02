import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
	ImportType,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const INITIALISER = `
const disflowInternalReadlineMod = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
`.trim();

const CLEANUP = "disflowInternalReadlineMod.close();";

export class Input extends BaseNode {
	static title: string = "Input";
	static category: string = "Console";

	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Console);
		this.addInput("Question", FlowIOTypes.Any);
		this.addProperty("question", "", FlowIOTypes.String);

		this.addWidget(
			"text",
			"Question",
			"",
			(v: string) => {
				if (v.trim() === "" && !this.inputs.at(1))
					this.addInput("Question", FlowIOTypes.Any);
				else if (this.inputs.at(1)) this.removeInput(1);

				this.properties.question = v;
			},
			{
				property: "question",
			},
		);

		this.addOutput("Answer", FlowIOTypes.String);

		this.addImport({
			type: ImportType.Everything,
			module: "readline",
			from: "node:readline/promises",
			packageVersion: "*",
			isFromNodeJS: true,
			initialiser: INITIALISER,
			cleanup: CLEANUP,
		});
	}

	nodeToCode(generator: BaseGenerator): string {
		const printValue = !this.inputs[1]?.link
			? JSON.stringify(this.properties.question)
			: generator.valueToCode(this, 1);

		return `(await disflowInternalReadlineMod.question(${printValue}))`;
	}
}
