import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrTextOrNull } from "../helpers";

export class DeleteRole extends BaseNode {
	static title = "Delete Role";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Role", FlowIOTypes.Object);
		this.addInput("Reason", FlowIOTypes.String);

		this.addProperty("reason", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Reason",
			"",
			(value: string) => {
				this.properties.reason = value;
			},
			{ property: "reason" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const role = generator.valueToCode(this, 1);
		const reason = inputOrTextOrNull(generator, this, 2, "reason");

		return reason
			? `await ${role}.delete(${reason});`
			: `await ${role}.delete();`;
	}
}
