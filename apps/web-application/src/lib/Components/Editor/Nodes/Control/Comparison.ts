import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const controls = {
    "=": "===",
    ">": ">",
    "<": "<",
    "≥": ">=",
    "≤": "<=",
    "≠": "!==",
    "AND": "&&",
    "OR": "||"
}

export class Compare extends BaseNode {
    static title: string = "Comparison";
    static category: string = "Control";
    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Control);
        this.addInput("A", FlowIOTypes.Any);
        this.addInput("B", FlowIOTypes.Any);

        this.addProperty("operator", "=", FlowIOTypes.String);

        this.addWidget('combo', "Operator", "=", (value) => {
            if (["AND", "OR"].includes(value)) {
                this.inputs[0].type = FlowIOTypes.Boolean;
                this.inputs[1].type = FlowIOTypes.Boolean;
            } else if (["<", ">", "≥", "≤"].includes(value)) {
                this.inputs[0].type = FlowIOTypes.Number;
                this.inputs[1].type = FlowIOTypes.Number;
            } else {
                this.inputs[0].type = FlowIOTypes.Any;
                this.inputs[1].type = FlowIOTypes.Any;
            }

            const inputs = [this.inputs[0], this.inputs[1]];

            if (this.graph) {
                for (let i = 0; i < inputs.length; i++) {
                    const input = inputs[i];
                    if (!input.link) continue;
                    const linkData = this.graph.links[input.link];
                    const origin = this.graph.getNodeById(linkData.origin_id);
                    if (!origin) continue;
                    const originSlot = linkData.origin_slot;

                    this.disconnectInput(i);
                    origin.connect(originSlot, this, i);
                }
            }

            this.properties.operator = value;
        }, {
            values: Object.keys(controls),
            property: "operator"
        })

        this.addOutput("Boolean", FlowIOTypes.Boolean);
    }

    nodeToCode(generator: BaseGenerator): string {
        const a = generator.valueToCode(this, 0);
        const b = generator.valueToCode(this, 1);

        return `${a} ${controls[this.properties.operator as keyof typeof controls]} ${b}`;
    }
}