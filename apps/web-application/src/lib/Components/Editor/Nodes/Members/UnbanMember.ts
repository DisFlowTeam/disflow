import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, inputOrTextOrNull } from "../helpers";

export class UnbanMember extends BaseNode {
	static title = "Unban Member";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Guild", FlowIOTypes.Object);
		this.addInput("User ID", FlowIOTypes.String);
		this.addInput("Reason", FlowIOTypes.String);

		this.addProperty("userId", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"User ID",
			"",
			(value: string) => {
				this.properties.userId = value;
			},
			{ property: "userId" },
		);

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
		const guild = generator.valueToCode(this, 1);
		const userId = inputOrText(generator, this, 2, "userId");
		const reason = inputOrTextOrNull(generator, this, 3, "reason");

		return `await ${guild}.members.unban(${userId}${reason ? `, ${reason}` : ""});`;
	}
}
