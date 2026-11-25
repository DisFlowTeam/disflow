import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrTextOrNull } from "../helpers";

/**
 * Sets a member's nickname. An empty nickname resets it to the username.
 */
export class SetNickname extends BaseNode {
	static title = "Set Nickname";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Member", FlowIOTypes.Object);
		this.addInput("Nickname", FlowIOTypes.String);
		this.addInput("Reason", FlowIOTypes.String);

		this.addProperty("nickname", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Nickname",
			"",
			(value: string) => {
				this.properties.nickname = value;
			},
			{ property: "nickname" },
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
		const member = generator.valueToCode(this, 1);
		const nickname = inputOrTextOrNull(generator, this, 2, "nickname");
		const reason = inputOrTextOrNull(generator, this, 3, "reason");

		return `await ${member}.setNickname(${nickname ?? "null"}${reason ? `, ${reason}` : ""});`;
	}
}
