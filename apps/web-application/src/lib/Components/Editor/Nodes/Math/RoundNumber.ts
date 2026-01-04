import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const controls = {
    "Round": "Math.round",
    "Round up": "Math.ceil",
    "Round down": "Math.floor",
}

export class RoundNumber extends BaseNode {
    static title: string = "Round Number";
    static category: string = "Maths";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Maths);
        this.addInput("Number", FlowIOTypes.Number);

        this.addProperty("number", 0.5, FlowIOTypes.Number);
        this.addWidget("number", "Number", 0.5, (v) => {
            this.properties.number = v;
        }, {
            property: "number"
        })

        this.addProperty("type", "Round", FlowIOTypes.String);
        this.addWidget("combo", "Type", "Round", (v) => {
            this.properties.type = v;
        }, {
            property: "type",
            values: Object.keys(controls)
        })

        this.addOutput("Number", FlowIOTypes.Number);
    }

    nodeToCode(generator: BaseGenerator): string {
        const number =
            this.inputs[0].link == null
                ? this.properties.number
                : generator.valueToCode(this, 0);
        
        return `${controls[this.properties.type as keyof typeof controls]}(${number})`
    }
}