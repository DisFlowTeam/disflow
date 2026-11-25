import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { jsonOrNull } from "../helpers";

/**
 * Builds a discord.js `EmbedBuilder`.
 *
 * Title, description, colour and footer can be driven by inputs; the
 * remaining fields are widget-only. Empty values are skipped so the builder
 * stays valid instead of receiving `""` for URLs or images.
 */
export class CreateEmbed extends BaseNode {
	static title = "Create Embed";
	static category = "Embeds";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Embeds);

		this.addInput("Title", FlowIOTypes.String);
		this.addInput("Description", FlowIOTypes.String);
		this.addInput("Color", FlowIOTypes.String);
		this.addInput("Footer", FlowIOTypes.String);

		this.addProperty("title", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Title",
			"",
			(value: string) => {
				this.properties.title = value;
			},
			{ property: "title" },
		);

		this.addProperty("description", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Description",
			"",
			(value: string) => {
				this.properties.description = value;
			},
			{ property: "description" },
		);

		this.addProperty("color", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Color",
			"",
			(value: string) => {
				this.properties.color = value;
			},
			{ property: "color" },
		);

		this.addProperty("url", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"URL",
			"",
			(value: string) => {
				this.properties.url = value;
			},
			{ property: "url" },
		);

		this.addProperty("author", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Author",
			"",
			(value: string) => {
				this.properties.author = value;
			},
			{ property: "author" },
		);

		this.addProperty("thumbnail", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Thumbnail URL",
			"",
			(value: string) => {
				this.properties.thumbnail = value;
			},
			{ property: "thumbnail" },
		);

		this.addProperty("image", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Image URL",
			"",
			(value: string) => {
				this.properties.image = value;
			},
			{ property: "image" },
		);

		this.addProperty("footer", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Footer",
			"",
			(value: string) => {
				this.properties.footer = value;
			},
			{ property: "footer" },
		);

		this.addProperty("timestamp", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Timestamp",
			false,
			(value: boolean) => {
				this.properties.timestamp = value;
			},
			{ property: "timestamp" },
		);

		this.addOutput("Embed", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const field = (inputIndex: number, property: string) => {
			if (this.inputs[inputIndex]?.link != null) {
				return generator.valueToCode(this, inputIndex);
			}

			return jsonOrNull(this.properties[property]);
		};

		let code = "new DisFlowDJS.EmbedBuilder()";

		const title = field(0, "title");
		if (title) code += `.setTitle(${title})`;

		const description = field(1, "description");
		if (description) code += `.setDescription(${description})`;

		const color = field(2, "color");
		if (color) code += `.setColor(${color})`;

		const footer = field(3, "footer");
		if (footer) code += `.setFooter({ text: ${footer} })`;

		const url = jsonOrNull(this.properties.url);
		if (url) code += `.setURL(${url})`;

		const author = jsonOrNull(this.properties.author);
		if (author) code += `.setAuthor({ name: ${author} })`;

		const thumbnail = jsonOrNull(this.properties.thumbnail);
		if (thumbnail) code += `.setThumbnail(${thumbnail})`;

		const image = jsonOrNull(this.properties.image);
		if (image) code += `.setImage(${image})`;

		if (this.properties.timestamp) code += `.setTimestamp()`;

		return code;
	}
}
