import { INodeInputSlot, LGraphNode, LiteGraph, INodeOutputSlot, widgetTypes } from "litegraph.js";
import { BaseGenerator } from "../Generator";
import { FlowIOTypes } from "../types";

declare module "litegraph.js" {
    interface LGraphNode {
        /* eslint-disable-next-line */
        onOutputAdded(output: INodeOutputSlot): any;
        /* eslint-disable-next-line */
        onInputAdded(input: INodeInputSlot): any;
    }
}

export abstract class BaseNode extends LGraphNode {
    static title: string;
    static category: string;
    static noFlows = false;

    title: string;
    category: string;
    indentExec = true;

    constructor() {
        super();
        
        const childNode = (this.constructor as typeof BaseNode);

        if (!childNode.noFlows) {
            this.addInput("Exec", FlowIOTypes.Flow);
            this.addOutput("Exec", FlowIOTypes.Flow);
        }

        this.onBuild();

        this.title = childNode.title;
        this.category = childNode.category;
    }

    private generateBgColor(color: string) {
        return color + "BB";
    }

    setNodeColor(hexadecimal: string) {
        this.color = hexadecimal;
        this.bgcolor = this.generateBgColor(hexadecimal);
    }

    static buildReferenceName() {
        return `${this.category}/${this.title}`;
    }

    static forEngine(engine: BaseGenerator) {
        engine.nodes.set(this.buildReferenceName(), (node, gen) => {
            return node.nodeToCode(gen);
        });
    }

    indentExecutionFlow(indent: boolean) {
        this.indentExec = indent;
    }

    buildReferenceName() {
        return `${this.category}/${this.title}`;
    }

    onConnectOutput(outputIndex: number, inputType: INodeInputSlot["type"]): boolean {
        const isExec = BaseGenerator.isExecutionPin(inputType);

        if (isExec) {
            const output = this.outputs[outputIndex];

            if (output.links && output.links.length > 0) {
                for (const linkId of output.links) {
                    this.graph?.removeLink(linkId);
                }
            }
        }

        return true;
    }

    onOutputAdded(output: INodeOutputSlot) {
        if(BaseGenerator.isExecutionPin(output.type)) output.shape = LiteGraph.ARROW_SHAPE;
    }

    onInputAdded(input: INodeInputSlot) {
        if(BaseGenerator.isExecutionPin(input.type)) input.shape = LiteGraph.ARROW_SHAPE;
    }

    /**
     * Called when the node is built. Handle names and categories here.
     */
    protected abstract onBuild(): void;

    abstract nodeToCode(generator: BaseGenerator): string;
}