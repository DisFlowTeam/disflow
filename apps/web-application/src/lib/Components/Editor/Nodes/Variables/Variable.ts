import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class Variable extends BaseNode {
    static title: string = "Variable";
    static category: string = "Variables";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Variables);
        this.addProperty("name", "myVariable", FlowIOTypes.String)
        this.addWidget("text", "Name", "myVariable", (v) => {
            this.properties.name = v;
        }, {
            property: "name"
        });
        this.addOutput("Value", FlowIOTypes.Any);
    }

    nodeToCode(): string {
        return `${this.properties.name || "myVariable"}`;
    }
}