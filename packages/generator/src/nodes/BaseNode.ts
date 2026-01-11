import { INodeInputSlot, LGraphNode, LiteGraph, INodeOutputSlot, widgetTypes } from "litegraph.js";
import { BaseGenerator } from "../Generator";
import { FlowIOTypes } from "../types";

declare module "litegraph.js" {
    interface LGraphNode {
        /* eslint-disable-next-line */
        onOutputAdded(output: INodeOutputSlot): any;
        /* eslint-disable-next-line */
        onInputAdded(input: INodeInputSlot): any;
    }
}

export enum ImportType {
    Object, // import { Module } from "mod";
    Default, // import Module from "mod";
    Everything // import * as Module from "mod";
}

export interface BaseImportDeclaration {
    from: string;
    packageVersion: string;
    type: ImportType;
    isFromNodeJS?: boolean;
    initialiser?: string;
    cleanup?: string;
}

export interface ObjectImportDeclaration extends BaseImportDeclaration {
    module: string[];
    type: ImportType.Object
}

export interface ImportDeclaration extends BaseImportDeclaration {
    module: string;
    type: ImportType.Default | ImportType.Everything;
}

export type AllImportDeclaration = ObjectImportDeclaration | ImportDeclaration;
export type AllImportDeclarationRaw = AllImportDeclaration & {
    importId: string;
}

export function constructImportId(statement: AllImportDeclaration) {
    let importId = "";

    if (statement.type === ImportType.Object) importId = `[${statement.module.sort().join("|")}]`;
    else importId = statement.module;

    importId += `@${statement.from}`;

    return importId;
}

export abstract class BaseNode extends LGraphNode {
    static title: string;
    static category: string;
    static noFlows = false;

    title: string;
    category: string;
    indentExec = true;

    imports = new Set<AllImportDeclarationRaw>();

    constructor() {
        super();

        const childNode = (this.constructor as typeof BaseNode);

        if (!childNode.noFlows) {
            this.addInput("Exec", FlowIOTypes.Flow);
            this.addOutput("Exec", FlowIOTypes.Flow);
        }

        this.onBuild();

        this.title = childNode.title;
        this.category = childNode.category;
    }

    private generateBgColor(color: string) {
        return color + "BB";
    }

    addImport(type: AllImportDeclaration) {
        const importId = constructImportId(type);
        Object.assign(type, {
            importId: importId
        });
        this.imports.add(type as unknown as AllImportDeclarationRaw);
    }

    setNodeColor(hexadecimal: string) {
        this.color = hexadecimal;
        this.bgcolor = this.generateBgColor(hexadecimal);
    }

    static buildReferenceName() {
        return `${this.category}/${this.title}`;
    }

    static forEngine(engine: BaseGenerator) {
        engine.nodes.set(this.buildReferenceName(), (node, gen) => {
            return node.nodeToCode(gen);
        });
    }

    indentExecutionFlow(indent: boolean) {
        this.indentExec = indent;
    }

    buildReferenceName() {
        return `${this.category}/${this.title}`;
    }

    onConnectOutput(outputIndex: number, inputType: INodeInputSlot["type"]): boolean {
        const isExec = BaseGenerator.isExecutionPin(inputType);

        if (isExec) {
            const output = this.outputs[outputIndex];

            if (output.links && output.links.length > 0) {
                for (const linkId of output.links) {
                    this.graph?.removeLink(linkId);
                }
            }
        }

        return true;
    }

    onOutputAdded(output: INodeOutputSlot) {
        if (BaseGenerator.isExecutionPin(output.type)) output.shape = LiteGraph.ARROW_SHAPE;
    }

    onInputAdded(input: INodeInputSlot) {
        if (BaseGenerator.isExecutionPin(input.type)) input.shape = LiteGraph.ARROW_SHAPE;
    }

    /**
     * Called when the node is built. Handle names and categories here.
     */
    protected abstract onBuild(): void;

    abstract nodeToCode(generator: BaseGenerator): string;
}