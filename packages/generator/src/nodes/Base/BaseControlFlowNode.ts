import type { GenerationContext } from "../../Generator";
import { BaseNode } from "./BaseNode";

// basically the ifs, and the whiles, and etc
export abstract class BaseControlFlowNode extends BaseNode {
    traverseOutputBranches(slot: number, visited: Set<BaseNode>) {
        const outputNodes = this.getOutputNodes(slot) as BaseNode[];
        const branches = new Set<BaseNode>();

        for(const node of outputNodes) {
            this.collectBranchNodes(node, branches, visited);
        }

        return branches;
    }

    generateCodeFromOutputBranch(slot: number, ctx: GenerationContext, visited: Set<BaseNode>) {
        const allChildNodes = this.traverseOutputBranches(slot, visited);

        let code = "";

        for(const child of allChildNodes) {
            code += child.onGenerateCode(ctx, visited);
        }

        return code;
    }

    private collectBranchNodes(node: BaseNode, branches: Set<BaseNode>, visited: Set<BaseNode>) {
        if(visited.has(node)) return;
        if(branches.has(node)) return;

        branches.add(node);
        visited.add(node);

        for(let i = 0; i < node.outputs.length; i++) {
            const outNodes = node.getOutputNodes(i);
            if(!outNodes) continue;
            for(const node of outNodes as BaseNode[]) {
                this.collectBranchNodes(node, branches, visited);
            }
        }
    }
}