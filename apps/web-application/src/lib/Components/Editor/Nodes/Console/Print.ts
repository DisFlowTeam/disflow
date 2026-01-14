import { BaseGenerator, BaseNode, FlowIOTypes, ImportType } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class Print extends BaseNode {
    static title: string = "Print";
    static category: string = "Console";

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Console);
        this.addProperty("content", "", FlowIOTypes.String);

        this.addWidget("text", "Content", "", (v: string) => {
            if(v.trim() === "" && !this.inputs.at(1)) this.addInput("content", FlowIOTypes.Any);
            else if(this.inputs.at(1)) this.removeInput(1);

            this.properties.content = v;
        }, {
            property: "content"
        })

        setTimeout(() => {
            if(!this.properties.content) this.addInput("Content", FlowIOTypes.Any);
        }, 100)
    }

    nodeToCode(generator: BaseGenerator): string {
        const printValue = this.inputs[1].link == null ? JSON.stringify(this.properties.content) : generator.valueToCode(this, 1);

        return `console.log(${printValue});`;
    }
}