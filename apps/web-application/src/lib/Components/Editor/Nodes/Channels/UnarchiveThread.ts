import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrTextOrNull } from "../helpers";

export class UnarchiveThread extends BaseNode {
	static title = "Unarchive Thread";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Thread", FlowIOTypes.Object);
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
		const thread = generator.valueToCode(this, 1);
		const reason = inputOrTextOrNull(generator, this, 2, "reason");

		return `await ${thread}.setArchived(false${reason ? `, ${reason}` : ""});`;
	}
}
