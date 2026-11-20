import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class DeleteChannel extends BaseNode {
	static title = "Delete Channel";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);
		this.addInput("Channel", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);

		return `await ${channel}.delete();`;
	}
}
