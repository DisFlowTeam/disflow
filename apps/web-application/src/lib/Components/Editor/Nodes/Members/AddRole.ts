import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class AddRole extends BaseNode {
	static title = "Add Role";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);
		this.addInput("Member", FlowIOTypes.Object);
		this.addInput("Role", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const member = generator.valueToCode(this, 1);
		const role = generator.valueToCode(this, 2);

		return `await ${member}.roles.add(${role});`;
	}
}
