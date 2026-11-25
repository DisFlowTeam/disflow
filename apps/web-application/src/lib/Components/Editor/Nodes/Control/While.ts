import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
	JavaScriptConstantStrings,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class While extends BaseNode {
	static title: string = "While";
	static category: string = "Control";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);
		this.addInput("Condition", FlowIOTypes.Boolean);
		this.addOutput("Perform", FlowIOTypes.Flow);
	}

	nodeToCode(generator: BaseGenerator): string {
		// Exec is input/output 0, so the condition is 1 and the loop body is
		// the "Perform" output, also at 1.
		const cond = generator.valueToCode(this, 1);
		const out = generator.statementToCode(this, 1);

		// statementToCode never returns an empty string: an empty body is the
		// no-op comment, which would loop forever. Break instead.
		const body = out === JavaScriptConstantStrings.NoOp ? "break" : out;

		return `while(${cond}) {\n${body}\n}`;
	}
}
