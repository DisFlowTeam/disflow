import { RootNode, FlowIOTypes, BaseGenerator } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class OnInteraction extends RootNode {
    static title: string = "On Interaction";
    static category: string = "Events";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Events);

        this.indentExecutionFlow(true);
        this.addOutput("run", FlowIOTypes.Flow);
    }

    nodeToCode(generator: BaseGenerator): string {
        return `client.on(DisFlowDJS.Events.InteractionCreate, (disflowCtx) => {\n${generator.statementToCode(this, 0)}\n});`;
    }
}