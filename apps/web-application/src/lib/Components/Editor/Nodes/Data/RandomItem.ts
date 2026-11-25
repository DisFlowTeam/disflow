import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Picks a random element. Wrapped in an arrow function so the list
 * expression is only evaluated once.
 */
export class RandomItem extends BaseNode {
	static title = "Random Item";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("List", FlowIOTypes.Array);
		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const list =
			this.inputs[0].link == null ? "[]" : generator.valueToCode(this, 0);

		return `((disflowList) => disflowList[Math.floor(Math.random() * disflowList.length)])((${list} ?? []))`;
	}
}
