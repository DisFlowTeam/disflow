import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, jsonOrNull } from "../helpers";

const STYLES = ["Primary", "Secondary", "Success", "Danger", "Link"];

/**
 * Builds a discord.js `ButtonBuilder`.
 *
 * `Link` buttons take a URL and no custom id; every other style takes a
 * custom id. The custom id is only emitted for non-link styles.
 */
export class CreateButton extends BaseNode {
	static title = "Create Button";
	static category = "Components";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Components);

		this.addInput("Label", FlowIOTypes.String);
		this.addInput("Custom ID", FlowIOTypes.String);

		this.addProperty("label", "Click me", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Label",
			"Click me",
			(value: string) => {
				this.properties.label = value;
			},
			{ property: "label" },
		);

		this.addProperty("customId", "button", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Custom ID",
			"button",
			(value: string) => {
				this.properties.customId = value;
			},
			{ property: "customId" },
		);

		this.addProperty("style", "Primary", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Style",
			"Primary",
			(value: string) => {
				this.properties.style = value;
			},
			{ property: "style", values: STYLES },
		);

		this.addProperty("url", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"URL (Link style)",
			"",
			(value: string) => {
				this.properties.url = value;
			},
			{ property: "url" },
		);

		this.addProperty("emoji", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Emoji",
			"",
			(value: string) => {
				this.properties.emoji = value;
			},
			{ property: "emoji" },
		);

		this.addProperty("disabled", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Disabled",
			false,
			(value: boolean) => {
				this.properties.disabled = value;
			},
			{ property: "disabled" },
		);

		this.addOutput("Button", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const label = inputOrText(generator, this, 0, "label");
		const style = STYLES.includes(String(this.properties.style))
			? String(this.properties.style)
			: "Primary";

		let code = `new DisFlowDJS.ButtonBuilder().setLabel(${label}).setStyle(DisFlowDJS.ButtonStyle.${style})`;

		if (style === "Link") {
			const url = jsonOrNull(this.properties.url);

			code += `.setURL(${url ?? '""'})`;
		} else {
			const customId = inputOrText(generator, this, 1, "customId");

			code += `.setCustomId(${customId})`;
		}

		const emoji = jsonOrNull(this.properties.emoji);
		if (emoji) code += `.setEmoji(${emoji})`;

		if (this.properties.disabled) code += `.setDisabled(true)`;

		return code;
	}
}
