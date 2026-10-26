import type { BaseGenerator } from "../Generator";
import { FlowIOTypes } from "../types";
import { RootNode } from "./RootNode";

// on program start node
export class OnProgramStartNode extends RootNode {
	static title = "On Start";
	static category = "Events";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor("#661111");
		this.indentExecutionFlow(false);
		this.addOutput("Start", FlowIOTypes.Flow);
	}

	nodeToCode(generator: BaseGenerator): string {
		return `// Program Start\n${generator.statementToCode(this, 0)}`;
	}
}
