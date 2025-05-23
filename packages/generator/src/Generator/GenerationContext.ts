// avoid cyclic deps issue ... though a bit wacky
import type { BaseNode } from "../../../nodes/src/nodes/BaseNode";

export class GenerationContext {
    nameMap = new Map<BaseNode, string>();
    usedNames = new Set<string>();

    requestUniqueName(node: BaseNode) {
        let count = 0;
        const title = node.title.toLowerCase()
        while(this.usedNames.has(`${title}_${count}`)) {
            count++;
        }
        const variableName = `${title}_${count}`;
        this.usedNames.add(variableName);
        this.nameMap.set(node, variableName);
        return variableName;
    }

    getVarNameByNode(node: BaseNode) {
        return this.nameMap.get(node);
    }
}