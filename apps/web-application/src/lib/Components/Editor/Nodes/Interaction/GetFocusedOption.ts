import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class GetFocusedOption extends BaseNode {
	static title = "Get Focused Option";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addProperty("full", false, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Full Option",
			false,
			(value: boolean) => {
				this.properties.full = value;
			},
			{
				property: "full",
			},
		);
		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const full = this.properties.full ? "true" : "";

		return `${interaction}?.options.getFocused(${full})`;
	}
}
