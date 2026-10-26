import {
	type BaseGenerator,
	FlowIOTypes,
	RootNode,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class OnMessage extends RootNode {
	static title: string = "On Message";
	static category: string = "Events";
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Events);

		this.indentExecutionFlow(true);
		this.addOutput("run", FlowIOTypes.Flow);
		this.addIntent("MessageContent");
		this.addIntent("GuildMessages");
	}

	nodeToCode(generator: BaseGenerator): string {
		return `client.on(DisFlowDJS.Events.MessageCreate, (disflowMessage) => {\n${generator.statementToCode(this, 0)}\n});`;
	}
}
