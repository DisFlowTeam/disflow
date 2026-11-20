import {
	type BaseGenerator,
	FlowIOTypes,
	RootNode,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Shared implementation for Discord gateway event entry points.
 *
 * Concrete event nodes only need to declare their event constant and callback
 * parameters. The generated listener is async so action nodes can await
 * discord.js calls.
 */
export abstract class DiscordEventRoot extends RootNode {
	static category = "Events";
	static noFlows = true;
	static eventName: string;
	static payload = "";
	static requiredIntents: string[] = [];

	protected onBuild(): void {
		const ctor = this.constructor as typeof DiscordEventRoot;

		this.setNodeColor(NodeCategoryColor.Events);
		this.indentExecutionFlow(true);
		this.addOutput("run", FlowIOTypes.Flow);

		for (const intent of ctor.requiredIntents) {
			this.addIntent(intent);
		}
	}

	nodeToCode(generator: BaseGenerator): string {
		const ctor = this.constructor as typeof DiscordEventRoot;

		return `disflowClient.on(DisFlowDJS.Events.${ctor.eventName}, async (${ctor.payload}) => {\n${generator.statementToCode(this, 0)}\n});`;
	}
}
