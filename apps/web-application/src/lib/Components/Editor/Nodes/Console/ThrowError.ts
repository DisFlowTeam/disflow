import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import type { LLink, INodeOutputSlot, INodeInputSlot } from "litegraph.js";

export class ThrowError extends BaseNode {
    static title: string = "Throw Error";
    static category: string = "Console";

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Console);
        this.addInput("Content", FlowIOTypes.Any);
        this.addProperty("content", "Your Error", FlowIOTypes.String);

        this.addWidget("text", "Content", "Your Error", (v: string) => {
            // if(v.trim() === "") this.addInput("content", FlowIOTypes.Any);
            // else this.removeInput(1);

            this.properties.content = v;
        }, {
            property: "content"
        })
    }

    nodeToCode(generator: BaseGenerator): string {
        const error = this.inputs[1].link == null ? JSON.stringify(this.properties.content) : generator.valueToCode(this, 1);

        return `throw ${error};`;
    }
}