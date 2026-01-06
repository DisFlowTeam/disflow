import type { LGraph } from "litegraph.js";
import { BaseNode } from "../nodes";
import { LiteGraph } from "litegraph.js";
import { FlowIOTypes } from "../types";

export enum GenerationErrorType {
    Arbitrary,
    CircularDependency
}

export class GenerationError extends Error {
    errorType: GenerationErrorType;

    constructor(message: string, errorType: GenerationErrorType = GenerationErrorType.Arbitrary) {
        super(message);
        this.errorType = errorType;
    }
}

export abstract class BaseGenerator {
    nodes = new Map<string, (node: BaseNode, gen: BaseGenerator) => string>();

    abstract valueToCode(node: BaseNode, inputIndex: number): string;
    abstract statementToCode(node: BaseNode, inputIndex: number): string;
    abstract graphToCode(graph: LGraph): string;

    static isExecutionPin(type: string | number): boolean {
        return type === LiteGraph.ACTION || type === LiteGraph.EVENT || type === -1 || type === FlowIOTypes.Flow;
    }

    indent(str: string) {
        return str.split("\n").map(l => `\t${l}`).join("\n");
    }

    getExecOutputNode(node: BaseNode): BaseNode | null {
        const outputData = node.outputs.findIndex((output) => output.name === "Exec" && BaseGenerator.isExecutionPin(output.type));
        if (outputData === -1) return null;
        const outputNode = node.getOutputNodes(outputData) as BaseNode[] | null;

        return outputNode && outputNode.length > 0 ? outputNode[0] : null;
    }

    hasGenerator(node: BaseNode) {
        return this.nodes.has(node.buildReferenceName());
    }

    executeGeneratorFunction(node: BaseNode) {
        const refName = this.nodes.get(node.buildReferenceName());

        if(refName) return refName(node, this);
    }
}