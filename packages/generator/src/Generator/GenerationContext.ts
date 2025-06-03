import type { BaseNode } from "../nodes";

export class GenerationContext {
    nameMap = new Map<BaseNode, string>();
    usedNames = new Set<string>();
    exceptions = new Map<typeof BaseNode, string>();

    deregisterException(node: typeof BaseNode) {
        return this.exceptions.delete(node);
    }

    registerException(node: typeof BaseNode, varName: string) {
        this.exceptions.set(node, varName);
    }

    isException(node: BaseNode) {
        const allExceptionKeys = this.exceptions.keys();

        for(const Key of allExceptionKeys) {
            if(node instanceof Key) return Key;
        }
    }

    requestUniqueName(node: BaseNode) {
        const exception = this.isException(node);
        if(exception) return this.exceptions.get(exception)!;

        if (this.nameMap.has(node)) return this.nameMap.get(node)!;
        let count = 0;
        const title = node.title.toLowerCase();
        while (this.usedNames.has(`${title}_${count}`)) {
            count++;
        }
        const variableName = `${title}_${count}`;
        this.usedNames.add(variableName);
        this.nameMap.set(node, variableName);
        return variableName;
    }

    getVarNameByNode(node: BaseNode) {
        const exception = this.isException(node);
        if(exception) return this.exceptions.get(exception)!;

        return this.nameMap.get(node);
    }
}
