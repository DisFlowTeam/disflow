import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Returns a new array with the value appended. Never mutates the input list,
 * which keeps chained nodes predictable.
 */
export class AddToList extends BaseNode {
	static title = "Add To List";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("List", FlowIOTypes.Array);
		this.addInput("Value", FlowIOTypes.Any);

		this.addOutput("List", FlowIOTypes.Array);
	}

	nodeToCode(generator: BaseGenerator): string {
		const list =
			this.inputs[0].link == null ? "[]" : generator.valueToCode(this, 0);
		const value =
			this.inputs[1].link == null
				? "undefined"
				: generator.valueToCode(this, 1);

		return `[...(${list} ?? []), ${value}]`;
	}
}
