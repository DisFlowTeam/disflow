import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

const TARGETS = {
	Subcommand: "getSubcommand",
	"Subcommand group": "getSubcommandGroup",
};

export class SubcommandMatch extends BaseNode {
	static title = "Subcommand Match";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addInput("Subcommand", FlowIOTypes.String);
		this.addProperty("name", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Subcommand",
			"",
			(value: string) => {
				this.properties.name = value;
			},
			{
				property: "name",
			},
		);

		this.addProperty("target", "Subcommand", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Target",
			"Subcommand",
			(value: string) => {
				this.properties.target = value;
			},
			{
				property: "target",
				values: Object.keys(TARGETS),
			},
		);

		this.addOutput("Matches", FlowIOTypes.Boolean);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");
		const method =
			TARGETS[this.properties.target as keyof typeof TARGETS] ??
			TARGETS.Subcommand;

		return `${interaction}?.options.${method}() === ${name}`;
	}
}
