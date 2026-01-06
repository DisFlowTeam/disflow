import type { LGraph, INodeInputSlot } from "litegraph.js";
import { BaseNode, OnProgramStartNode, RootNode } from "../nodes";
import { BaseGenerator, GenerationError, GenerationErrorType } from "./BaseGenerator";

export enum JavaScriptConstantStrings {
    Null = "null",
    Undefined = "undefined",
    NoOp = "// NO OPERATION"
}

export class JavaScriptGenerator extends BaseGenerator {
    private visitedNodes = new Set<number>();
    // Cache for valueToCode since these statements can be somewhat computationally expensive
    private codeCache = new Map<number, string>();

    // walk up the execution connections
    valueToCode(node: BaseNode, inputIndex: number): string {
        const iNode = node.getInputNode(inputIndex) as BaseNode | null;
        const iInfo = node.getInputInfo(inputIndex);

        if (!iInfo || BaseGenerator.isExecutionPin(iInfo.type) || !iNode) {
            console.warn(`WARNING: Attemped to generate code for input ${inputIndex} of ${node.title} but input was not found or was a flow type.`);
            return JavaScriptConstantStrings.Null;
        }

        if (this.visitedNodes.has(iNode.id)) throw new GenerationError("The graph contains circular dependencies", GenerationErrorType.CircularDependency);

        if(this.codeCache.has(iNode.id)) return this.codeCache.get(iNode.id)!;

        try {
            if (!this.hasGenerator(iNode)) {
                console.warn(`WARNING: Attemped to generate code for input ${inputIndex} of ${node.title} but input node was not registered with the JavaScript generator for code generation.`);
                return JavaScriptConstantStrings.Null;
            }

            this.visitedNodes.add(iNode.id)

            const code = this.executeGeneratorFunction(iNode)!;
            this.codeCache.set(iNode.id, code);
            return code.trim();
        } finally {
            // delete the nodes from the visited nodes so other branches of the graph can use the code safely
            this.visitedNodes.delete(iNode.id);
        }
    }

    getInputNodesFromNode(node: BaseNode) {
        return node.inputs
            .map((input, i) => {
                return {
                    input,
                    node: node.getInputNode(i) as BaseNode | null
                }
            })
            .filter(v => v.node && !BaseGenerator.isExecutionPin(v.input.type)) as { node: BaseNode, input: INodeInputSlot }[];

    }

    // walk down the execution connections
    statementToCode(node: BaseNode, outputIndex: number): string {
        let finalCode = "";
        const oNodes = node.getOutputNodes(outputIndex) as BaseNode[] | null || [];
        const oInfo = node.getOutputInfo(outputIndex);

        if (!oInfo || !BaseGenerator.isExecutionPin(oInfo.type) || oNodes.length === 0 || oInfo.links.length > 1) {
            console.warn(`WARNING: Attemped to generate statement code for output ${outputIndex} of ${node.title} but output was not found or was not a flow type or there was more than 1 way to flow which confused the engine.`);
            return JavaScriptConstantStrings.NoOp;
        }

        const oNode = oNodes[0];

        if (!this.hasGenerator(oNode)) {
            console.warn(`WARNING: Attemped to generate statement code for output ${outputIndex} of ${node.title} but output node was not registered with the JavaScript generator for code generation.`);
            return JavaScriptConstantStrings.NoOp;
        }

        finalCode = this.executeGeneratorFunction(oNode)!;

        finalCode += `\n${this.walkDownStream(oNode)}`;

        return (node.indentExec ? this.indent(finalCode) : finalCode).trimEnd();
    }

    /**
     * Walk down all the "Exec" path
     * @param node The starting node
     */
    walkDownStream(node: BaseNode) {
        const code: string[] = [];

        const visited = new Set<number>();

        let processingNode = this.getExecOutputNode(node);

        while (processingNode) {
            // safe guard against possible infinite loop in case graph contains a circle
            if (visited.has(processingNode.id)) throw new GenerationError("Unable to generate graph code as it contains circular dependencies.", GenerationErrorType.CircularDependency);
            visited.add(processingNode.id);

            if (!this.hasGenerator(processingNode)) {
                console.log(`WARNING: Node ${processingNode.title} does not have a generator function`)
                code.push(JavaScriptConstantStrings.NoOp);
                continue;
            }

            code.push(this.executeGeneratorFunction(processingNode)!);

            processingNode = this.getExecOutputNode(processingNode);
        }

        return code.join("\n")
    }

    graphToCode(graph: LGraph): string {
        let codeString: string[] = [];

        // @ts-expect-error need to get all nodes. Could not find any public API to do so (even though there should be one there)
        const nodes = graph._nodes as BaseNode[];

        // filter all the 'roots'
        const roots = nodes.filter((node) => node instanceof RootNode);

        if (roots.length === 0) throw new GenerationError("Node roots were found in the graph.");

        const defaultRootIndex = roots.findIndex((node) => node instanceof OnProgramStartNode);

        if (defaultRootIndex === -1) throw new GenerationError("No 'On Program Start' root node found in the graph.");

        const defaultRoot = roots.splice(defaultRootIndex, 1)[0] as OnProgramStartNode;
        roots.unshift(defaultRoot);
        // process each root node
        for (const root of roots) {
            if (!this.hasGenerator(root)) {
                console.warn(`Cannot generate code for ${root.title}. This is a root node and nothing for this branch will be generated.`);
                continue;
            }

            codeString.push(this.executeGeneratorFunction(root)!);
        }

        this.visitedNodes.clear();
        this.codeCache.clear();

        return codeString.join("\n");
    }
}