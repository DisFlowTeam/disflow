import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class Text extends BaseNode {
	static title: string = "Text";
	static category: string = "Text Tools";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.TextTools);
		this.addProperty("txt", "Your Text", FlowIOTypes.String);

		this.addWidget(
			"text",
			"Text",
			"Your Text",
			(v) => {
				this.properties.txt = v;
			},
			{
				property: "txt",
			},
		);

		this.addOutput("Text", FlowIOTypes.String);
	}

	nodeToCode(): string {
		return JSON.stringify(this.properties.txt ?? "Your Text");
	}
}
