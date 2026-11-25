import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, inputOrTextOrNull } from "../helpers";

export class RenameChannel extends BaseNode {
	static title = "Rename Channel";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Name", FlowIOTypes.String);
		this.addInput("Reason", FlowIOTypes.String);

		this.addProperty("name", "renamed-channel", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"renamed-channel",
			(value: string) => {
				this.properties.name = value;
			},
			{ property: "name" },
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
		const channel = generator.valueToCode(this, 1);
		const name = inputOrText(generator, this, 2, "name");
		const reason = inputOrTextOrNull(generator, this, 3, "reason");

		return `await ${channel}.setName(${name}${reason ? `, ${reason}` : ""});`;
	}
}
