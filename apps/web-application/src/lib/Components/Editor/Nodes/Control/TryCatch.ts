import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Wraps a branch in `try` and runs the catch branch when it throws.
 *
 * The caught error is intentionally not exposed as a value; use a `Print`
 * node inside the catch branch if you need to log it.
 */
export class TryCatch extends BaseNode {
	static title = "Try Catch";
	static category = "Control";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);

		this.addOutput("Try", FlowIOTypes.Flow);
		this.addOutput("Catch", FlowIOTypes.Flow);
	}

	nodeToCode(generator: BaseGenerator): string {
		// Exec is output 0, so the two branches are outputs 1 and 2.
		const tryBody = generator.statementToCode(this, 1);
		const catchBody = generator.statementToCode(this, 2);

		return `try {\n${tryBody}\n} catch {\n${catchBody}\n}`;
	}
}
