import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

export class FindChannel extends BaseNode {
	static title = "Find Channel";
	static category = "Channels";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

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
		this.addOutput("Channel", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const guild = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");

		return `${guild}.channels.cache.find((channel) => channel.name === ${name})`;
	}
}
