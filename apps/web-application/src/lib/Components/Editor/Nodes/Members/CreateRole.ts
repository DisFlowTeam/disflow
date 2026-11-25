import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText, inputOrTextOrNull, jsonOrNull } from "../helpers";

export class CreateRole extends BaseNode {
	static title = "Create Role";
	static category = "Members";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Guild", FlowIOTypes.Object);
		this.addInput("Name", FlowIOTypes.String);
		this.addInput("Color", FlowIOTypes.String);

		this.addProperty("name", "new-role", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"new-role",
			(value: string) => {
				this.properties.name = value;
			},
			{ property: "name" },
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

		this.addProperty("hoist", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Hoist",
			false,
			(value: boolean) => {
				this.properties.hoist = value;
			},
			{ property: "hoist" },
		);

		this.addProperty("mentionable", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Mentionable",
			false,
			(value: boolean) => {
				this.properties.mentionable = value;
			},
			{ property: "mentionable" },
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

		this.addOutput("Role", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const guild = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");
		const color = inputOrTextOrNull(generator, this, 2, "color");
		const reason = jsonOrNull(this.properties.reason);

		const fields = [
			`name: ${name}`,
			`hoist: ${this.properties.hoist === true}`,
			`mentionable: ${this.properties.mentionable === true}`,
		];

		if (color) fields.push(`color: ${color}`);
		if (reason) fields.push(`reason: ${reason}`);

		return `await ${guild}.roles.create({ ${fields.join(", ")} })`;
	}
}
