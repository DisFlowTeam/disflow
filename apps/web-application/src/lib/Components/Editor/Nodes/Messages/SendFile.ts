import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, jsonOrNull } from "../helpers";

/**
 * Sends a local file or URL as an attachment.
 *
 * Relative paths resolve from the generated bot's working directory.
 */
export class SendFile extends BaseNode {
	static title = "Send File";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Content", FlowIOTypes.Any);

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

		this.addProperty("file", "./file.png", FlowIOTypes.String);
		this.addWidget(
			"text",
			"File",
			"./file.png",
			(value: string) => {
				this.properties.file = value;
			},
			{ property: "file" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const file = jsonOrNull(this.properties.file) ?? '"./file.png"';
		const hasContent =
			this.inputs[2].link != null ||
			String(this.properties.content ?? "").trim().length > 0;

		if (!hasContent) {
			return `await ${channel}.send({ files: [${file}] });`;
		}

		const content = inputOrText(generator, this, 2, "content");

		return `await ${channel}.send({ content: ${content}, files: [${file}] });`;
	}
}
