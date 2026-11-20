import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const TYPES = {
	Slash: "ApplicationCommand",
	Button: "MessageComponent",
	Autocomplete: "ApplicationCommandAutocomplete",
	Modal: "ModalSubmit",
};

export class IsInteractionType extends BaseNode {
	static title = "Is Interaction Type";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addProperty("type", "Slash", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Type",
			"Slash",
			(value: string) => {
				this.properties.type = value;
			},
			{
				property: "type",
				values: Object.keys(TYPES),
			},
		);
		this.addOutput("Matches", FlowIOTypes.Boolean);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const type =
			TYPES[this.properties.type as keyof typeof TYPES] ?? TYPES.Slash;

		return `${interaction}?.type === DisFlowDJS.InteractionType.${type}`;
	}
}
