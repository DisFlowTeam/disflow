import { BaseNode, type GenerationContext } from "@disflow-team/code-gen";

export class Sum extends BaseNode {
    static category: string = "Maths";
    static title: string = "Sum";

    builder(): void {
        this.setName("Sum");
        this.addInput("first", "number");
        this.addInput("second", "number");
        this.addOutput("output", "number");
    }

    onGenerateCode(ctx: GenerationContext): string {
        const [firstNode, secondNode] = [this.getInputNode(0), this.getInputNode(1)] as BaseNode[]

        const fName = ctx.nameMap.get(firstNode);
        const sName = ctx.nameMap.get(secondNode);
        return `const ${ctx.requestUniqueName(this)} = ${fName || 0} + ${sName || 0}`.trim();
    }
}