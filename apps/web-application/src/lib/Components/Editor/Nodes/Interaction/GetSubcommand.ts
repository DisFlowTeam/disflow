import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class GetSubcommand extends BaseNode {
	static title = "Get Subcommand";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);
		this.addInput("Interaction", FlowIOTypes.Object);
		this.addOutput("Subcommand", FlowIOTypes.String);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);

		return `${interaction}?.options.getSubcommand()`;
	}
}
