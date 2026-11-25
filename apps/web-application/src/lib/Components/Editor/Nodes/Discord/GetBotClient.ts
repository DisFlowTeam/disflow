import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Exposes the generated client.
 *
 * `Event Value` only works inside event handlers, so this node makes the
 * client reachable from the main file as well.
 */
export class GetBotClient extends BaseNode {
	static title = "Get Bot Client";
	static category = "Discord";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Discord);
		this.addOutput("Client", FlowIOTypes.Object);
	}

	nodeToCode(): string {
		return "disflowClient";
	}
}
