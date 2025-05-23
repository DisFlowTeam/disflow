import { type INodeOutputSlot, LGraphNode } from "litegraph.js";
import type { GenerationContext } from "@disflow-team/code-gen"

export interface BaseNode {
    onOutputAdded?: (output: INodeOutputSlot) => any;
}

export abstract class BaseNode extends LGraphNode {
    constructor() {
        super();
        this.builder();
        this.serialize_widgets = true;
    }

    static category: string;
    static title: string;

    static buildName() {
        return `${this.category}/${this.title}`
    }

    /**
     * Set the name of the node
     * @param name the name of the node
     */
    protected setName(name: string) {
        this.title = name;
        return this;
    }

    protected insertOutput(index: number, name: string, type: string | -1, extraInfo?: INodeOutputSlot) {
        if(index > this.outputs.length - 1) throw new Error(`Cannot insert there. Output length is is only ${this.outputs.length}. Maxmium insert is ${this.outputs.length - 1}.`)
        const output: INodeOutputSlot =  { name, type, links: null };
        if(extraInfo) {
            for (const i in extraInfo) {
                // @ts-expect-error
                output[i] = extraInfo[i];
            }
        }

        if(!this.outputs) this.outputs = [];
        this.outputs.splice(index, 0, output);

        if(this.onOutputAdded) {
            this.onOutputAdded(output)
        }
    }

    /**
     * Called when the node is constructed
     */
    protected abstract builder(): void;
    /**
     * Called when the node is needed to generate code
     * @param ctx The context of the current generation
     */
    abstract onGenerateCode(ctx: GenerationContext): string;
}