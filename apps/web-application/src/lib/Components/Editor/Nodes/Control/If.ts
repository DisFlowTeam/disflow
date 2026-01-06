// import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
// import { NodeCategoryColor } from "../Colors";

// const controls = {
//     "=": "===",
//     ">": ">",
//     "<": "<",
//     "≥": ">=",
//     "≤": "<=",
//     "≠": "!==",
//     "AND": "&&",
//     "OR": "||"
// }

// export class If extends BaseNode {
//     static title: string = "If";
//     static category: string = "Control";

//     protected onBuild(): void {
//         this.setNodeColor(NodeCategoryColor.Control);

//         this.addInput("A", FlowIOTypes.Any);
//         this.addInput("B", FlowIOTypes.Any);

//         this.addOutput("Then", FlowIOTypes.Flow);

//         this.addProperty("useElse", false, FlowIOTypes.Boolean);
//         this.addProperty("operator", "=", FlowIOTypes.String);

//         this.addWidget("toggle", "Use Else", this.properties.useElse as boolean, (value) => {
//             this.setProperty("useElse", value as boolean);
//             this.updateElseOutput();
//         })

//         this.addWidget('combo', "Operator", "=", (value) => {
//             if (["AND", "OR"].includes(value)) {
//                 this.inputs[1].type = FlowIOTypes.Boolean;
//                 this.inputs[2].type = FlowIOTypes.Boolean;
//             } else {
//                 this.inputs[1].type = FlowIOTypes.Any;
//                 this.inputs[2].type = FlowIOTypes.Any;
//             }

//             const inputs = [this.inputs[1], this.inputs[2]];

//             if (this.graph) {
//                 for (let i = 0; i < inputs.length; i++) {
//                     const input = inputs[i];
//                     if(!input.link) continue;
//                     const linkData = this.graph.links[input.link];
//                     const origin = this.graph.getNodeById(linkData.origin_id);
//                     if(!origin) continue;
//                     const originSlot = linkData.origin_slot;

//                     this.disconnectInput(i + 1);
//                     origin.connect(originSlot, this, i + 1);
//                 }
//             }

//             this.properties.operator = value;
//         }, {
//             values: Object.keys(controls),
//             property: "operator"
//         })
//     }

//     updateElseOutput() {
//         // 0 is execution pin, 1 is then and 2 is else
//         const elseIndex = 2;

//         if (this.properties.useElse && this.outputs.length < 3) {
//             this.addOutput("Else", FlowIOTypes.Flow);
//         } else if (this.outputs.length > 2) {
//             this.removeOutput(elseIndex);
//         }
//     }

//     nodeToCode(generator: BaseGenerator): string {
//         const then = generator.statementToCode(this, 1);
//         let code = `if(${generator.valueToCode(this, 1)} ${controls[this.properties.operator as keyof typeof controls]} ${generator.valueToCode(this, 2)}) {\n${then}\n}`;

//         if (this.properties.useElse && this.outputs.at(2) && Number(this.outputs.at(2)!.links?.length) > 0) {
//             code += ` else {\n${generator.statementToCode(this, 2)}\n}`;
//         }

//         return code;
//     }
// }

import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class If extends BaseNode {
  static title = "If";
  static category = "Control";

  protected onBuild(): void {
    this.setNodeColor(NodeCategoryColor.Control);

    // condition input
    this.addInput("Condition", FlowIOTypes.Boolean);

    // flow outputs
    this.addOutput("Then", FlowIOTypes.Flow);

    // optional else
    this.addProperty("useElse", false, FlowIOTypes.Boolean);

    this.addWidget(
      "toggle",
      "Use Else",
      this.properties.useElse,
      (value) => {
        this.properties.useElse = value as boolean;
        this.updateElseOutput();
      }
    );
  }

  updateElseOutput() {
    const hasElse = this.outputs.some(o => o.name === "Else");

    if (this.properties.useElse && !hasElse) {
      this.addOutput("Else", FlowIOTypes.Flow);
    }

    if (!this.properties.useElse && hasElse) {
      const index = this.outputs.findIndex(o => o.name === "Else");
      if (index !== -1) this.removeOutput(index);
    }
  }

  nodeToCode(generator: BaseGenerator): string {
    const condition = generator.valueToCode(this, 1);

    let code = `if (${condition}) {\n`;
    code += generator.statementToCode(this, 1);
    code += `\n}`;

    if (this.properties.useElse && this.outputs.some(o => o.name === "Else")) {
      code += ` else {\n`;
      code += generator.statementToCode(this, 2);
      code += `\n}`;
    }

    return code;
  }
}
