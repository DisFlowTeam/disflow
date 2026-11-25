import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class MoveMemberToVoice extends BaseNode {
	static title = "Move Member To Voice";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Member", FlowIOTypes.Object);
		this.addInput("Voice Channel", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const member = generator.valueToCode(this, 1);
		const channel = generator.valueToCode(this, 2);

		return `await ${member}.voice.setChannel(${channel});`;
	}
}
