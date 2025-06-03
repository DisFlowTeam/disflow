import type { LGraph } from "litegraph.js";
import type { BaseNode } from "../nodes";
import { GenerationContext } from "./GenerationContext";
import { BaseControlFlowNode } from "../nodes/Base/BaseControlFlowNode";

function sortTopologically(graph: LGraph) {
    const visited = new Set<BaseNode>();
    const tempMarks = new Set<BaseNode>(); // detect if execution goes in a loop ...
    const sorted: BaseNode[] = [];

    function visit(node: BaseNode) {
        if(visited.has(node)) return;
        if(tempMarks.has(node)) return;

        tempMarks.add(node);

        for(const input of node.inputs || []) {
            if(!input || !input.link) continue;
            const link = graph.links[input.link];
            if(!link) continue;
            const inputNode = graph.getNodeById(link.origin_id);
            if(inputNode) visit(inputNode as BaseNode);
        }

        tempMarks.delete(node);
        visited.add(node);
        sorted.push(node);
    }

    // @ts-expect-error
    (graph._nodes as BaseNode[]).forEach(node => {
        if(!visited.has(node)) visit(node);
    })

    return sorted;
}

export function generateCode(graph: LGraph) {
    const sorted = sortTopologically(graph);
    const visited = new Set<BaseNode>();
    const context = new GenerationContext();
    let code: { i: number, c: string }[] = [];

    sorted.forEach((node, i) => {
        if(visited.has(node)) return;
        if(!(node instanceof BaseControlFlowNode)) return;

        code.push({ i, c: node.onGenerateCode(context, visited) })
        
        visited.add(node);
    })

    sorted.forEach((node, i) => {
        if(visited.has(node)) return;
        const c = node.onGenerateCode(context, visited);
        code.push({ i, c });
    })

    return code.sort((a, b) => a.i - b.i).map(v => v.c).join("\n").trim();
}