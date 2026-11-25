import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Builds an array from up to four connected values.
 *
 * Unconnected inputs are skipped, so an empty node produces `[]`.
 */
export class CreateList extends BaseNode {
	static title = "Create List";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		for (let i = 1; i <= 4; i++) {
			this.addInput(`Item ${i}`, FlowIOTypes.Any);
		}

		this.addOutput("List", FlowIOTypes.Array);
	}

	nodeToCode(generator: BaseGenerator): string {
		const items: string[] = [];

		for (let i = 0; i < this.inputs.length; i++) {
			if (this.inputs[i].link == null) continue;

			items.push(generator.valueToCode(this, i));
		}

		return `[${items.join(", ")}]`;
	}
}
