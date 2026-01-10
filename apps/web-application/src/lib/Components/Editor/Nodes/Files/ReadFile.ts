import { BaseGenerator, BaseNode, ImportType, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

export class ReadFile extends BaseNode {
    static title: string = "Read File";
    static category: string = "Files";

    static noFlows: boolean = true;

    protected onBuild(): void {
        this.setNodeColor(NodeCategoryColor.Files);

        this.addImport({
            from: "fs",
            module: "fs",
            type: ImportType.Default,
            packageVersion: "*"
        });

        this.addInput("File Name", FlowIOTypes.String);
        this.addOutput("Content", FlowIOTypes.String);
    }

    nodeToCode(generator: BaseGenerator): string {
        return `fs.readFileSync(${generator.valueToCode(this, 0)}, "utf8")`;
    }
}