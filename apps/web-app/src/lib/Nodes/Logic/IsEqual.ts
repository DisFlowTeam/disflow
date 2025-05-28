import { BaseNode, type GenerationContext } from "@disflow-team/code-gen";

export class EqualNode extends BaseNode {
    static title: string = "equal";
    static category: string = "Logic";

    builder(): void {
        this.setName("equal");
        this.addInput("first", "*");
        this.addInput("second", "*");
        this.addOutput("output", "boolean");
    }

    onGenerateCode(ctx: GenerationContext): string {
        const fNode = this.getInputNode(0) as BaseNode | null;
        const sNode = this.getInputNode(1) as BaseNode | null;

        const [fName, sName] = [
            fNode ? ctx.getVarNameByNode(fNode) : "false",
            sNode ? ctx.getVarNameByNode(sNode) : "false"
        ];

        const name = ctx.requestUniqueName(this);

        return `const ${name} = ${fName || "false"} === ${sName || "false"}`
    }
}