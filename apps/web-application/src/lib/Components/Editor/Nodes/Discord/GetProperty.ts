import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Safely reads a (possibly nested) property from a discord.js object.
 *
 * `property` accepts dot paths, e.g. `member.user.username` or
 * `guild.memberCount`. Every segment is optional-chained.
 */
export class GetProperty extends BaseNode {
	static title = "Get Property";
	static category = "Discord";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Discord);

		this.addInput("Object", FlowIOTypes.Any);
		this.addProperty("property", "name", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Property",
			"name",
			(value: string) => {
				this.properties.property = value;
			},
			{
				property: "property",
			},
		);
		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const object = generator.valueToCode(this, 0);
		const property = String(this.properties.property ?? "").trim();

		if (property.length === 0) return object;

		const path = property
			.split(".")
			.map((part) => part.trim())
			.filter(Boolean);

		return `${object}${path.map((part) => `?.${part}`).join("")}`;
	}
}
