import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

/**
 * Sends a message with up to two action rows attached.
 *
 * Leaves out `content` when the widget is empty so component-only messages
 * are not rejected for having an empty string.
 */
export class SendWithComponents extends BaseNode {
	static title = "Send With Components";
	static category = "Components";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Components);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Content", FlowIOTypes.Any);
		this.addInput("Row 1", FlowIOTypes.Object);
		this.addInput("Row 2", FlowIOTypes.Object);

		this.addProperty("content", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Content",
			"",
			(value: string) => {
				this.properties.content = value;
			},
			{ property: "content" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const rows: string[] = [];

		for (const index of [3, 4]) {
			if (this.inputs[index]?.link != null) {
				rows.push(generator.valueToCode(this, index));
			}
		}

		const hasContent =
			this.inputs[2].link != null ||
			String(this.properties.content ?? "").trim().length > 0;

		if (rows.length === 0) {
			const content = inputOrText(generator, this, 2, "content");
			return `await ${channel}.send(${content});`;
		}

		const content = hasContent
			? `content: ${inputOrText(generator, this, 2, "content")}, `
			: "";

		return `await ${channel}.send({ ${content}components: [${rows.join(", ")}] });`;
	}
}
