import { BaseGenerator, BaseNode } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

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