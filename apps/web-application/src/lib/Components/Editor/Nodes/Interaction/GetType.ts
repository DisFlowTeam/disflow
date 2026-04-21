import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class GetIntType extends BaseNode {
    static title: string = "Get int type";
    static category: string = "Interaction";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Interaction);
        this.addOutput("type", FlowIOTypes.Any);
        this.addInput("Interaction", FlowIOTypes.Object);
    }

    nodeToCode(generator: BaseGenerator): string {
        return `${generator.valueToCode(this, 0)}?.type`;
    }
}