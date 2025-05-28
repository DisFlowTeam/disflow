import { type GenerationContext, BaseControlFlowNode, type BaseNode } from "@disflow-team/code-gen";

export class IfNode extends BaseControlFlowNode {
    static title: string = "if";
    static category: string = "control";

    protected builder(): void {
        this.setName("if");
        this.addInput("condition", "boolean");
        this.addOutput("then", "*");
    }

    onGenerateCode(ctx: GenerationContext, visited: Set<BaseNode>): string {
        const inputNode = this.getInputNode(0);
        const varName = ctx.requestUniqueName(inputNode as BaseNode);

        const body = this.generateCodeFromOutputBranch(0, ctx, visited);

        return `if(${varName}) {\n${body}\n};`
    }
}