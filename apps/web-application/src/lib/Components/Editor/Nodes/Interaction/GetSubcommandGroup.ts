import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class GetSubcommandGroup extends BaseNode {
	static title = "Get Subcommand Group";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);
		this.addInput("Interaction", FlowIOTypes.Object);
		this.addOutput("Group", FlowIOTypes.String);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);

		return `${interaction}?.options.getSubcommandGroup()`;
	}
}
