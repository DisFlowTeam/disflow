import { INodeInputSlot, type INodeOutputSlot, LGraphNode } from "litegraph.js";
import type { GenerationContext } from "../../Generator";
import { getGraph } from "@disflow-team/utils"

export enum FlowMode {
    Off,
    On,
    Dynamic
}

declare module "litegraph.js" {
    interface LGraphNode {
        onOutputAdded: (output: INodeOutputSlot) => any;
        onInputAdded: (input: INodeInputSlot) => any;
    }
}

export abstract class BaseNode extends LGraphNode {
    includeFlow: FlowMode = FlowMode.On;
    private inputHandler: undefined | LGraphNode['onInputAdded'];
    private outputHandler: undefined | LGraphNode['onOutputAdded'];

    constructor() {
        super();
        if (this.includeFlow === FlowMode.On || this.includeFlow === FlowMode.Dynamic) {
            this.addInput("flow in", "flow");
            this.addOutput("flow out", "flow");

            if (this.includeFlow === FlowMode.Dynamic) {
                if (!this.properties) {
                    this.properties = {};
                }
                this.properties.__flowState = true;
                this.addWidget("toggle", "Toggle Flow", true, (v: boolean) => {
                    this.properties.__flowState = v;
                    if (!v) {
                        const flowOut = this.outputs.findIndex(v => v.name === "flow out");
                        const flowIn = this.inputs.findIndex(v => v.name === "flow in");

                        if(!this.graph) this.graph = getGraph();
                        if (flowOut !== -1) this.removeOutput(flowOut)
                        if (flowIn !== -1) this.inputs.splice(flowIn, 1)
                    } else {
                        this.addInput("flow in", "flow");
                        this.addOutput("flow out", "flow");
                    }
                })
            }
        }
        this.builder();
        this.serialize_widgets = true;
    }

    static category: string;
    static title: string;

    setName(name: string) {
        this.title = name;
        return this;
    }

    static buildName() {
        return `${this.category}/${this.title}`
    }

    protected setInputAddedHandler(cb: LGraphNode['onInputAdded']) {
        this.inputHandler = cb;
    }

    protected setOutputAddedHandler(cb: LGraphNode['onOutputAdded']) {
        this.outputHandler = cb;
    }

    onOutputAdded = (output: INodeOutputSlot) => {
        if (this.includeFlow === FlowMode.Off) {
            if (this.outputHandler) this.outputHandler(output);
            return;
        }

        if (output.name === "flow out" && output.type === "flow") return;
        if (this.includeFlow === FlowMode.On || (this.includeFlow === FlowMode.Dynamic && this.properties.__flowState)) {
            const flowOut = this.outputs.findIndex(v => v.name === "flow out" && v.type === "flow");
            if (flowOut !== -1) {
                if(!this.graph) this.graph = getGraph();
                this.removeOutput(flowOut);
            }
            this.addOutput("flow out", "flow");
            if (this.outputHandler) this.outputHandler(output);
        }
    };

    onInputAdded = (input: INodeInputSlot) => {
        if (this.includeFlow === FlowMode.Off) {
            if (this.inputHandler) this.inputHandler(input);
            return;
        }

        if (input.name === "flow in" && input.type === "flow") return;
        if (this.includeFlow === FlowMode.On || (this.includeFlow === FlowMode.Dynamic && this.properties.__flowState)) {
            const flowIn = this.inputs.findIndex(v => v.name === "flow in");
            if (flowIn !== -1) {
                if(!this.graph) this.graph = getGraph();
                this.removeInput(flowIn);
            }
            this.addInput("flow in", "flow");
            if (this.inputHandler) this.inputHandler(input);
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
    abstract onGenerateCode(ctx: GenerationContext, visited: Set<BaseNode>): string;
}