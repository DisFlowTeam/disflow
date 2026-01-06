import { BaseNode, FlowIOTypes, BaseGenerator } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import type { LLink, INodeInputSlot, INodeOutputSlot } from "litegraph.js";

export class CreateText extends BaseNode {

    static title: string = "Create Text With";
    static category: string = "Text Tools";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.TextTools);
        this.addInput("A", FlowIOTypes.Any);
        this.addInput("B", FlowIOTypes.Any);
        this.addOutput("Text", FlowIOTypes.String);

        this.addProperty("A", "Your Text", FlowIOTypes.String);
        this.addWidget("text", "A", "Your Text", (v: string) => {
            this.properties.A = v;
        }, {
            property: "A"
        })

        this.addProperty("B", "Your Text", FlowIOTypes.String);
        this.addWidget("text", "B", "Your Text", (v: string) => {
            this.properties.B = v;
        }, {
            property: "B"
        })
    }

    nodeToCode(generator: BaseGenerator): string {
        let A, B;

        if ((this.inputs[0].link != null) && (this.getInputDataType(0) == FlowIOTypes.String)) {
            A = generator.valueToCode(this, 0);
        } else {
            A =
                this.inputs[0].link == null
                    ? JSON.stringify(this.properties.A)
                    : `String(${generator.valueToCode(this, 0)})`;
        }

        if ((this.inputs[1].link != null) && (this.getInputDataType(1) == FlowIOTypes.String)) {
            B = generator.valueToCode(this, 1);
        } else {
            B =
                this.inputs[1].link == null
                    ? JSON.stringify(this.properties.B)
                    : `String(${generator.valueToCode(this, 1)})`;
        }
        
        return `(${A} + ${B})`
    }
}