import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrTextOrNull } from "../helpers";

export class RemoveTimeout extends BaseNode {
	static title = "Remove Timeout";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Member", FlowIOTypes.Object);
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
		const member = generator.valueToCode(this, 1);
		const reason = inputOrTextOrNull(generator, this, 2, "reason");

		return `await ${member}.timeout(null${reason ? `, ${reason}` : ""});`;
	}
}
