import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, jsonOrNull } from "../helpers";

/**
 * Builds a discord.js `TextInputBuilder`, used inside a modal.
 *
 * The label is required by Discord, so it is always emitted.
 */
export class AddTextInput extends BaseNode {
	static title = "Add Text Input";
	static category = "Components";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Components);

		this.addInput("Label", FlowIOTypes.String);

		this.addProperty("label", "Input", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Label",
			"Input",
			(value: string) => {
				this.properties.label = value;
			},
			{ property: "label" },
		);

		this.addProperty("customId", "input", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Custom ID",
			"input",
			(value: string) => {
				this.properties.customId = value;
			},
			{ property: "customId" },
		);

		this.addProperty("style", "Short", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Style",
			"Short",
			(value: string) => {
				this.properties.style = value;
			},
			{ property: "style", values: ["Short", "Paragraph"] },
		);

		this.addProperty("placeholder", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Placeholder",
			"",
			(value: string) => {
				this.properties.placeholder = value;
			},
			{ property: "placeholder" },
		);

		this.addProperty("required", true, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Required",
			true,
			(value: boolean) => {
				this.properties.required = value;
			},
			{ property: "required" },
		);

		this.addProperty("minLength", 0, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Min Length",
			0,
			(value: number) => {
				this.properties.minLength = value;
			},
			{ property: "minLength" },
		);

		this.addProperty("maxLength", 0, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Max Length",
			0,
			(value: number) => {
				this.properties.maxLength = value;
			},
			{ property: "maxLength" },
		);

		this.addOutput("Component", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const label = inputOrText(generator, this, 0, "label");
		const customId = jsonOrNull(this.properties.customId) ?? '"input"';
		const style =
			String(this.properties.style) === "Paragraph" ? "Paragraph" : "Short";

		let code = `new DisFlowDJS.TextInputBuilder().setLabel(${label}).setCustomId(${customId}).setStyle(DisFlowDJS.TextInputStyle.${style})`;

		const placeholder = jsonOrNull(this.properties.placeholder);
		if (placeholder) code += `.setPlaceholder(${placeholder})`;

		if (this.properties.required === false) code += `.setRequired(false)`;

		const min = Number(this.properties.minLength);
		const max = Number(this.properties.maxLength);

		if (Number.isFinite(min) && min > 0) code += `.setMinLength(${min})`;
		if (Number.isFinite(max) && max > 0) code += `.setMaxLength(${max})`;

		return code;
	}
}
