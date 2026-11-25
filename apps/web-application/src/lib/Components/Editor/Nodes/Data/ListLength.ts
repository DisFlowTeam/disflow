import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class ListLength extends BaseNode {
	static title = "List Length";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("List", FlowIOTypes.Array);
		this.addOutput("Length", FlowIOTypes.Number);
	}

	nodeToCode(generator: BaseGenerator): string {
		const list =
			this.inputs[0].link == null ? "[]" : generator.valueToCode(this, 0);

		return `(${list} ?? []).length`;
	}
}
