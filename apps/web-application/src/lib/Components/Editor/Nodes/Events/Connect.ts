import { BaseGenerator, FlowIOTypes, RootNode } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class OnConnect extends RootNode {
    static title: string = "On Connect";
    static category: string = "Events";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Events);

        this.indentExecutionFlow(true);
        this.addOutput("run", FlowIOTypes.Flow);
    }

    nodeToCode(generator: BaseGenerator): string {
        return `client.on(Events.Ready, () => {\n${generator.statementToCode(this, 0)}\n});`
    }
}