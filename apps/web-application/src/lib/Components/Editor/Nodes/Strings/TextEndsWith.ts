import { BaseNode, FlowIOTypes, BaseGenerator } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class TextEndsWith extends BaseNode {

    static title: string = "Text Ends With";
    static category: string = "Text Tools";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.TextTools);
        this.addInput("Text", FlowIOTypes.Any);
        this.addInput("Ends With", FlowIOTypes.Any);
        this.addOutput("Boolean", FlowIOTypes.Boolean);

        this.addProperty("txt", "Your Text", FlowIOTypes.String);
        this.addWidget("text", "Text", "Your Text", (v: string) => {
            this.properties.txt = v;
        }, {
            property: "txt"
        })

        this.addProperty("endswith", "a", FlowIOTypes.String);
        this.addWidget("text", "Starts With", "a", (v: string) => {
            this.properties.endswith = v;
        }, {
            property: "endswith"
        })
    }

    nodeToCode(generator: BaseGenerator): string {
        let txt, endsWith;

        if ((this.inputs[0].link != null) && (this.getInputDataType(0) == FlowIOTypes.String)) {
            txt = generator.valueToCode(this, 0);
        } else {
            txt =
                this.inputs[0].link == null
                    ? JSON.stringify(this.properties.txt)
                    : `String(${generator.valueToCode(this, 0)})`;
        }

        if ((this.inputs[1].link != null) && (this.getInputDataType(1) == FlowIOTypes.String)) {
            endsWith = generator.valueToCode(this, 1);
        } else {
            endsWith =
                this.inputs[1].link == null
                    ? JSON.stringify(this.properties.endswith)
                    : `String(${generator.valueToCode(this, 1)})`;
        }
        
        return `(${txt}.endsWith(${endsWith}))`
    }
}