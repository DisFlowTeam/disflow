import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, jsonOrNull, parseChoices } from "../helpers";

/**
 * Builds a discord.js `StringSelectMenuBuilder`.
 *
 * Options are written as `Label=value, Other=other` in the widget.
 */
export class CreateSelectMenu extends BaseNode {
	static title = "Create Select Menu";
	static category = "Components";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Components);

		this.addInput("Custom ID", FlowIOTypes.String);

		this.addProperty("customId", "menu", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Custom ID",
			"menu",
			(value: string) => {
				this.properties.customId = value;
			},
			{ property: "customId" },
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

		this.addProperty(
			"options",
			"General=general, Help=help",
			FlowIOTypes.String,
		);
		this.addWidget(
			"text",
			"Options",
			"General=general, Help=help",
			(value: string) => {
				this.properties.options = value;
			},
			{ property: "options" },
		);

		this.addProperty("minValues", 1, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Min Values",
			1,
			(value: number) => {
				this.properties.minValues = value;
			},
			{ property: "minValues" },
		);

		this.addProperty("maxValues", 1, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Max Values",
			1,
			(value: number) => {
				this.properties.maxValues = value;
			},
			{ property: "maxValues" },
		);

		this.addOutput("Menu", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const customId = inputOrText(generator, this, 0, "customId");

		let code = `new DisFlowDJS.StringSelectMenuBuilder().setCustomId(${customId})`;

		const placeholder = jsonOrNull(this.properties.placeholder);
		if (placeholder) code += `.setPlaceholder(${placeholder})`;

		const options = parseChoices(this.properties.options);
		if (options.length > 0) {
			const entries = options
				.map(
					(option) =>
						`{ label: ${JSON.stringify(option.name)}, value: ${JSON.stringify(option.value)} }`,
				)
				.join(", ");

			code += `.addOptions([${entries}])`;
		}

		const min = Number(this.properties.minValues);
		const max = Number(this.properties.maxValues);

		if (Number.isFinite(min) && min > 0) code += `.setMinValues(${min})`;
		if (Number.isFinite(max) && max > 0) code += `.setMaxValues(${max})`;

		return code;
	}
}
