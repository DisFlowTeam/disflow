import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import type { LLink, INodeOutputSlot, INodeInputSlot } from "litegraph.js";

export class ClearConsole extends BaseNode {
    static title: string = "Clear Console";
    static category: string = "Console";

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Console);
    }

    nodeToCode(generator: BaseGenerator): string {
        return `console.clear();`;
    }
}