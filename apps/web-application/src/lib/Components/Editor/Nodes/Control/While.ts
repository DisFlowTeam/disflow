import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
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
		const cond = generator.valueToCode(this, 0);
		const out = generator.statementToCode(this, 0);
		return `while(${cond}) {\n${out}\n}`;
	}
}
