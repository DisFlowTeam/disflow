import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrNumber, inputOrTextOrNull } from "../helpers";

/**
 * Times a member out. Discord caps timeouts at 28 days.
 */
export class TimeoutMember extends BaseNode {
	static title = "Timeout Member";
	static category = "Members";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Member", FlowIOTypes.Object);
		this.addInput("Minutes", FlowIOTypes.Number);
		this.addInput("Reason", FlowIOTypes.String);

		this.addProperty("minutes", 10, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Minutes",
			10,
			(value: number) => {
				this.properties.minutes = value;
			},
			{ property: "minutes" },
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
		const minutes = inputOrNumber(generator, this, 2, "minutes", 10);
		const reason = inputOrTextOrNull(generator, this, 3, "reason");

		return `await ${member}.timeout((${minutes}) * 60_000${reason ? `, ${reason}` : ""});`;
	}
}
