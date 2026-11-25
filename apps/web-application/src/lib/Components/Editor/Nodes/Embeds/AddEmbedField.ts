import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

/**
 * Adds a field to an embed and returns the same builder so nodes can be
 * chained. Starts a new embed when nothing is connected.
 */
export class AddEmbedField extends BaseNode {
	static title = "Add Embed Field";
	static category = "Embeds";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Embeds);

		this.addInput("Embed", FlowIOTypes.Object);
		this.addInput("Name", FlowIOTypes.String);
		this.addInput("Value", FlowIOTypes.String);

		this.addProperty("name", "Field", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"Field",
			(value: string) => {
				this.properties.name = value;
			},
			{ property: "name" },
		);

		this.addProperty("value", "Value", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Value",
			"Value",
			(value: string) => {
				this.properties.value = value;
			},
			{ property: "value" },
		);

		this.addProperty("inline", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Inline",
			false,
			(value: boolean) => {
				this.properties.inline = value;
			},
			{ property: "inline" },
		);

		this.addOutput("Embed", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const embed =
			this.inputs[0].link == null
				? "new DisFlowDJS.EmbedBuilder()"
				: generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");
		const value = inputOrText(generator, this, 2, "value");

		return `(${embed}.addFields({ name: ${name}, value: ${value}, inline: ${this.properties.inline === true} }))`;
	}
}
