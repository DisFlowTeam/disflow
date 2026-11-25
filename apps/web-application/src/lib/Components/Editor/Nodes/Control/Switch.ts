import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Branches on a value with up to four cases plus a default.
 *
 * Case values are compared with `===` through a `switch` statement. Blank
 * cases are skipped. Exec is output 0, so case outputs start at 1 and the
 * default is output 5.
 */
export class Switch extends BaseNode {
	static title = "Switch";
	static category = "Control";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);

		this.addInput("Value", FlowIOTypes.Any);

		for (let i = 1; i <= 4; i++) {
			this.addProperty(`case${i}`, "", FlowIOTypes.String);
			this.addWidget(
				"text",
				`Case ${i}`,
				"",
				(value: string) => {
					this.properties[`case${i}`] = value;
				},
				{ property: `case${i}` },
			);

			this.addOutput(`Case ${i}`, FlowIOTypes.Flow);
		}

		this.addOutput("Default", FlowIOTypes.Flow);
	}

	nodeToCode(generator: BaseGenerator): string {
		// Exec is input 0, so the switched value is input 1.
		const value = generator.valueToCode(this, 1);
		const lines = [`switch (${value}) {`];

		for (let i = 1; i <= 4; i++) {
			const caseValue = String(this.properties[`case${i}`] ?? "").trim();

			if (caseValue.length === 0) continue;

			// Case bodies are at output 1..4.
			const body = generator.statementToCode(this, i);

			lines.push(`case ${JSON.stringify(caseValue)}:`, body, "\tbreak;");
		}

		// The default body is the last declared output.
		lines.push("default:", generator.statementToCode(this, 5), "\tbreak;", "}");

		return lines.join("\n");
	}
}
