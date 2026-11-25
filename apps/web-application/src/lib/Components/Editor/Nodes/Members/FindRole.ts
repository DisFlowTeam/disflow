import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class FindRole extends BaseNode {
	static title = "Find Role";
	static category = "Members";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Guild", FlowIOTypes.Object);
		this.addInput("Name", FlowIOTypes.String);
		this.addProperty("name", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Name",
			"",
			(value: string) => {
				this.properties.name = value;
			},
			{
				property: "name",
			},
		);
		this.addOutput("Role", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const guild = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");

		return `${guild}.roles.cache.find((role) => role.name === ${name})`;
	}
}
