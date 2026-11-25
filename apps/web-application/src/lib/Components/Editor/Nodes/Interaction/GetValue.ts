import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const VALUES = {
	User: "user",
	Member: "member",
	Guild: "guild",
	Channel: "channel",
	ID: "id",
	"Custom ID": "customId",
	"Command Name": "commandName",
	Locale: "locale",
	Replied: "replied",
	Deferred: "deferred",
	"Created At": "createdAt",
};

export class GetInteractionValue extends BaseNode {
	static title = "Get Interaction Value";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addProperty("value", "User", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Value",
			"User",
			(value: string) => {
				this.properties.value = value;
			},
			{
				property: "value",
				values: Object.keys(VALUES),
			},
		);
		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const value =
			VALUES[this.properties.value as keyof typeof VALUES] ?? "user";

		return `${interaction}?.${value}`;
	}
}
