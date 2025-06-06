import { BaseControlFlowNode, BaseNode, FlowIOTypes, FlowMode, GenerationContext } from "@disflow-team/code-gen";

export class WhileNode extends BaseControlFlowNode {
    static title: string = "While";
    static category: string = "control";

    properties: { isIncludeAfter: boolean } = {
        isIncludeAfter: false
    };

    protected builder(): void {
        this.includeFlow = FlowMode.Off;
        this.setName("While");
        this.addInput("condition", FlowIOTypes.Boolean);
        this.addOutput("Run", FlowIOTypes.Any);
        this.addWidget("toggle", "Incldue After", this.properties.isIncludeAfter, (v: boolean) => {
            this.properties.isIncludeAfter = v;
            if(v) return this.addOutput("After", FlowIOTypes.Any);
            this.removeOutput(this.outputs.length - 1);
        });
    }

    onGenerateCode(ctx: GenerationContext, visited: Set<BaseNode>): string {
        const conditionNode = this.getInputNode(0);
        let conditionVar = "false";
        if(conditionNode) conditionVar = ctx.requestUniqueName(conditionNode as BaseNode);

        const bodyNode = this.getOutputNodes(0)
        let bodyCode = "";
        if(bodyNode.length > 0) bodyCode = this.generateCodeFromOutputBranch(0, ctx, visited);

        let outSideBody: undefined | string = undefined;

        if(this.properties.isIncludeAfter) outSideBody = this.generateCodeFromOutputBranch(1, ctx, visited);

        return `while(${conditionVar}) {\n\t${bodyCode}\n};${outSideBody ? `\n${outSideBody}` : ""}`;
    }
}