import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const SELECTIONS = {
	Values: "values",
	Users: "users",
	Members: "members",
	Channels: "channels",
	Roles: "roles",
	Attachments: "attachments",
};

export class GetSelection extends BaseNode {
	static title = "Get Selection";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addProperty("selection", "Values", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Selection",
			"Values",
			(value: string) => {
				this.properties.selection = value;
			},
			{
				property: "selection",
				values: Object.keys(SELECTIONS),
			},
		);
		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const selection =
			SELECTIONS[this.properties.selection as keyof typeof SELECTIONS] ??
			SELECTIONS.Values;

		return `${interaction}?.${selection}`;
	}
}
