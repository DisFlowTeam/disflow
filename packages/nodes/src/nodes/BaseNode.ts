import { LGraphNode } from "litegraph.js";
import type { GenerationContext } from "@disflow-team/code-gen"

export class BaseNode extends LGraphNode {
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
    setName(name: string) {
        this.title = name;
        return this;
    }

    /**
     * Called when the node is constructed
     */
    builder() {
        throw new Error('Not implemented');
    }

    /**
     * Called when the node is needed to generate code
     * @param ctx The context of the current generation
     */
    onGenerateCode(ctx: GenerationContext): string {
        throw new Error("Not implemented");
    }
}