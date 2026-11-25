import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, jsonOrNull } from "../helpers";

const TYPES = {
	Text: "GuildText",
	Voice: "GuildVoice",
	Category: "GuildCategory",
	Announcement: "GuildAnnouncement",
	Forum: "GuildForum",
	Stage: "GuildStageVoice",
} as const;

export class CreateChannel extends BaseNode {
	static title = "Create Channel";
	static category = "Channels";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Guild", FlowIOTypes.Object);
		this.addInput("Name", FlowIOTypes.String);

		this.addProperty("name", "new-channel", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"new-channel",
			(value: string) => {
				this.properties.name = value;
			},
			{ property: "name" },
		);

		this.addProperty("type", "Text", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Type",
			"Text",
			(value: string) => {
				this.properties.type = value;
			},
			{ property: "type", values: Object.keys(TYPES) },
		);

		this.addProperty("topic", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Topic",
			"",
			(value: string) => {
				this.properties.topic = value;
			},
			{ property: "topic" },
		);

		this.addProperty("nsfw", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"NSFW",
			false,
			(value: boolean) => {
				this.properties.nsfw = value;
			},
			{ property: "nsfw" },
		);

		this.addProperty("parent", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Parent ID",
			"",
			(value: string) => {
				this.properties.parent = value;
			},
			{ property: "parent" },
		);

		this.addProperty("reason", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Reason",
			"",
			(value: string) => {
				this.properties.reason = value;
			},
			{ property: "reason" },
		);

		this.addOutput("Channel", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const guild = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");
		const type =
			TYPES[this.properties.type as keyof typeof TYPES] ?? "GuildText";

		const fields = [`name: ${name}`, `type: DisFlowDJS.ChannelType.${type}`];

		const topic = jsonOrNull(this.properties.topic);
		if (topic) fields.push(`topic: ${topic}`);

		if (this.properties.nsfw) fields.push("nsfw: true");

		const parent = jsonOrNull(this.properties.parent);
		if (parent) fields.push(`parent: ${parent}`);

		const reason = jsonOrNull(this.properties.reason);
		if (reason) fields.push(`reason: ${reason}`);

		return `await ${guild}.channels.create({ ${fields.join(", ")} })`;
	}
}
