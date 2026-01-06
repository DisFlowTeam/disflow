import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class NumberNode extends BaseNode {
    static title: string = "Number";
    static category: string = "Maths";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Maths);
        this.addProperty("number", 0, FlowIOTypes.Number)
        this.addWidget("number", "Number", 0, (v) => {
            this.properties.number = v;
        }, {
            property: "number"
        });
        this.addOutput("Number", FlowIOTypes.Number);
    }

    nodeToCode(): string {
        return `${this.properties.number || 0}`;
    }
}