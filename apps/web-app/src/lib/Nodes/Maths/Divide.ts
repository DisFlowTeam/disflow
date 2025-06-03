import { BaseNode, FlowIOTypes, FlowMode, GenerationContext } from "@disflow-team/code-gen";

export class DivideNode extends BaseNode {
    static title: string = "Divide";
    static category: string = "Number";

    protected builder(): void {
        this.setName("Divide");
        this.includeFlow = FlowMode.Dynamic;

        this.addInputs([
            ["number 1", FlowIOTypes.Number, {}],
            ["number 2", FlowIOTypes.Number, {}]
        ]);

        this.addOutput("output", FlowIOTypes.Number);
    }

    onGenerateCode(ctx: GenerationContext): string {
        const varName = ctx.requestUniqueName(this);
        const [name1, name2] = [0, 1].map(v => {
            const node = this.getInputNode(v);
            if(!node) return "0";
            return ctx.getVarNameByNode(node as BaseNode);
        })
        return `const ${varName} = ${name1} / ${name2};`
    }
}