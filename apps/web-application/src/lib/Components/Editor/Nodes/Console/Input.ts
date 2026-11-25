import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
	ImportType,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

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
				// This node has no exec pins, so "Question" is input 0 and
				// always exists. The widget is only the fallback value.
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
		});
	}

	nodeToCode(generator: BaseGenerator): string {
		// No implicit exec pins on this node, so the question is input 0.
		const question =
			this.inputs[0].link == null
				? JSON.stringify(this.properties.question)
				: generator.valueToCode(this, 0);

		// Self-contained on purpose: generator initialisers are only emitted
		// into the main file, so a module-level readline interface would be
		// missing from event and command files. Creating and closing it per
		// call also keeps working when a handler runs more than once.
		return `(await (async () => {
	const disflowReadline = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	try {
		return await disflowReadline.question(${question});
	} finally {
		disflowReadline.close();
	}
})())`;
	}
}
