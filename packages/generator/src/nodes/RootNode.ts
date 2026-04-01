import { FlowIOTypes } from "../types";
import { BaseNode } from "./BaseNode";

export abstract class RootNode extends BaseNode {
    protected onBuild(): void {
        this.indentExecutionFlow(false);
        this.addOutput("Start", FlowIOTypes.Flow);
    }
}
