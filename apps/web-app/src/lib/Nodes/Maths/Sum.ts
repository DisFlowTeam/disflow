import { BaseNode, FlowIOTypes, type GenerationContext } from "@disflow-team/code-gen";

export class Sum extends BaseNode {
    static category: string = "Maths";
    static title: string = "Sum";

    builder(): void {
        this.setName("Sum");
        this.addInput("first", FlowIOTypes.Number);
        this.addInput("second", FlowIOTypes.Number);
        this.addOutput("output", FlowIOTypes.Number);
    }

    onGenerateCode(ctx: GenerationContext): string {
        const [firstNode, secondNode] = [this.getInputNode(0), this.getInputNode(1)] as BaseNode[]

        const fName = ctx.getVarNameByNode(firstNode);
        const sName = ctx.getVarNameByNode(secondNode);
        return `const ${ctx.requestUniqueName(this)} = ${fName || 0} + ${sName || 0}`.trim();
    }
}