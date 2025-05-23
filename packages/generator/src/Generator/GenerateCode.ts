import type { LGraph } from "litegraph.js";
// this is wacky ngl ...
import type { BaseNode } from "../../../nodes/src/nodes/BaseNode";
import { GenerationContext } from "./GenerationContext";

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
    const sorted = sortTopologically(graph)
    const context = new GenerationContext();
    let code = "";

    sorted.forEach((node) => {
        // @ts-expect-error
        const c = node.onGenerateCode(context);
        code += `${c}\n`;
    })

    return code.trim();
}