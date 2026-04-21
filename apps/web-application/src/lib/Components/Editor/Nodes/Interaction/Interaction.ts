import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class Interaction extends BaseNode {
    static noFlows: boolean = true;
    static title: string = "Interaction";
    static category: string = "Interaction";
    
    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Interaction);
        this.addOutput("int", FlowIOTypes.Object);
    }

    nodeToCode(): string {
        return "disflowCtx";
    }
}