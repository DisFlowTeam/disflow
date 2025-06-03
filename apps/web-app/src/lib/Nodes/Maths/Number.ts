import { BaseNode, type GenerationContext } from "@disflow-team/code-gen";

export class NumberNode extends BaseNode {
    static category: string = "Maths";
    static title: string = "Number";

    builder(): void {
        this.setName("Number");
        this.addOutput("value", "number");
        this.properties = {
            value: 0
        };
        this.addWidget("number", "Number", this.properties.value as number, (val: number) => {
            console.log("called", val)
            this.properties.value = val;
        })
    }

    onGenerateCode(ctx: GenerationContext): string {
        const name = ctx.requestUniqueName(this);
        return `const ${name} = ${this.properties.value as number};`;
    }
}