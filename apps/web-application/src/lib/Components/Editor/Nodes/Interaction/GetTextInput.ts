import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class GetTextInput extends BaseNode {
	static title = "Get Text Input";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addInput("Custom ID", FlowIOTypes.String);
		this.addProperty("customId", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Custom ID",
			"",
			(value: string) => {
				this.properties.customId = value;
			},
			{
				property: "customId",
			},
		);
		this.addOutput("Value", FlowIOTypes.String);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const customId = inputOrText(generator, this, 1, "customId");

		return `${interaction}?.fields.getTextInputValue(${customId})`;
	}
}
