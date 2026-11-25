import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class AddMemberToThread extends BaseNode {
	static title = "Add Member To Thread";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Thread", FlowIOTypes.Object);
		this.addInput("Member", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const thread = generator.valueToCode(this, 1);
		const member = generator.valueToCode(this, 2);

		return `await ${thread}.members.add(${member});`;
	}
}
