import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

/**
 * Opens a modal. Pass action rows built from `Add Text Input` nodes; the
 * submission is read later with `Get Text Input`.
 */
export class ShowModal extends BaseNode {
	static title = "Show Modal";
	static category = "Interaction";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addInput("Custom ID", FlowIOTypes.String);
		this.addInput("Title", FlowIOTypes.String);
		this.addInput("Row 1", FlowIOTypes.Object);
		this.addInput("Row 2", FlowIOTypes.Object);

		this.addProperty("customId", "modal", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Custom ID",
			"modal",
			(value: string) => {
				this.properties.customId = value;
			},
			{ property: "customId" },
		);

		this.addProperty("title", "Modal", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Title",
			"Modal",
			(value: string) => {
				this.properties.title = value;
			},
			{ property: "title" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 1);
		const customId = inputOrText(generator, this, 2, "customId");
		const title = inputOrText(generator, this, 3, "title");

		const rows: string[] = [];

		for (const index of [4, 5]) {
			if (this.inputs[index]?.link != null) {
				rows.push(generator.valueToCode(this, index));
			}
		}

		const components =
			rows.length > 0 ? `.addComponents(${rows.join(", ")})` : "";

		return `await ${interaction}.showModal(new DisFlowDJS.ModalBuilder().setCustomId(${customId}).setTitle(${title})${components});`;
	}
}
