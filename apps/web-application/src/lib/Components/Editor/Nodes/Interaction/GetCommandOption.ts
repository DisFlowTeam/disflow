import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

const METHODS = {
	String: "getString",
	Integer: "getInteger",
	Number: "getNumber",
	Boolean: "getBoolean",
	User: "getUser",
	Member: "getMember",
	Channel: "getChannel",
	Role: "getRole",
	Mentionable: "getMentionable",
	Attachment: "getAttachment",
};

export class GetCommandOption extends BaseNode {
	static title = "Get Command Option";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
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

		this.addProperty("optionType", "String", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Option Type",
			"String",
			(value: string) => {
				this.properties.optionType = value;
			},
			{
				property: "optionType",
				values: Object.keys(METHODS),
			},
		);

		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const name = inputOrText(generator, this, 1, "name");
		const method =
			METHODS[this.properties.optionType as keyof typeof METHODS] ??
			METHODS.String;

		return `${interaction}?.options.${method}(${name})`;
	}
}
