import type { LGraph, INodeInputSlot } from "litegraph.js";
import { BaseNode, ImportType, OnProgramStartNode, RootNode } from "../nodes";
import { BaseGenerator, GenerationError, GenerationErrorType } from "./BaseGenerator";

const IMPORT_STATEMENT = [
    "// ------------ START DISFLOW IMPORT STATEMENTS ------------",
    "// ------------ END DISFLOW IMPORT STATEMENTS ------------",
];

export enum JavaScriptConstantStrings {
    Null = "null",
    Undefined = "undefined",
    NoOp = "// NO OPERATION",
}

export interface JavaScriptImport {
    modules: string[];
    type: ImportType;
    version: string;
    package: string;
    isNode: boolean;
}

export class JavaScriptGenerator extends BaseGenerator {
    private visitedNodes = new Set<number>();
    // Cache for valueToCode since these statements can be somewhat computationally expensive
    private codeCache = new Map<number, string>();

    private imports = new Map<string, JavaScriptImport>();
    private initialisers = new Set<string>();
    private cleanupCode = new Set<string>();
	private intents = new Set<string>();

    // walk up the execution connections
    valueToCode(node: BaseNode, inputIndex: number): string {
        const iNode = node.getInputNode(inputIndex) as BaseNode | null;
        const iInfo = node.getInputInfo(inputIndex);

        if (!iInfo || BaseGenerator.isExecutionPin(iInfo.type) || !iNode) {
            console.warn(
                `WARNING: Attemped to generate code for input ${inputIndex} of ${node.title} but input was not found or was a flow type.`
            );
            return JavaScriptConstantStrings.Null;
        }

        if (this.visitedNodes.has(iNode.id))
            throw new GenerationError(
                "The graph contains circular dependencies",
                GenerationErrorType.CircularDependency
            );

        if (this.codeCache.has(iNode.id)) return this.codeCache.get(iNode.id)!;

        try {
            if (!this.hasGenerator(iNode)) {
                console.warn(
                    `WARNING: Attemped to generate code for input ${inputIndex} of ${node.title} but input node was not registered with the JavaScript generator for code generation.`
                );
                return JavaScriptConstantStrings.Null;
            }

            this.visitedNodes.add(iNode.id);

            const code = this.executeGeneratorFunction(iNode)!;
            this.codeCache.set(iNode.id, code);
            return code.trim();
        } finally {
            // delete the nodes from the visited nodes so other branches of the graph can use the code safely
            this.visitedNodes.delete(iNode.id);
        }
    }

    getInputNodesFromNode(node: BaseNode) {
        return node.inputs
            .map((input, i) => {
                return {
                    input,
                    node: node.getInputNode(i) as BaseNode | null,
                };
            })
            .filter((v) => v.node && !BaseGenerator.isExecutionPin(v.input.type)) as {
            node: BaseNode;
            input: INodeInputSlot;
        }[];
    }

    // walk down the execution connections
    statementToCode(node: BaseNode, outputIndex: number): string {
        let finalCode = "";
        const oNodes = (node.getOutputNodes(outputIndex) as BaseNode[] | null) || [];
        const oInfo = node.getOutputInfo(outputIndex);

        if (
            !oInfo ||
            !BaseGenerator.isExecutionPin(oInfo.type) ||
            oNodes.length === 0 ||
            oInfo.links.length > 1
        ) {
            console.warn(
                `WARNING: Attemped to generate statement code for output ${outputIndex} of ${node.title} but output was not found or was not a flow type or there was more than 1 way to flow which confused the engine.`
            );
            return JavaScriptConstantStrings.NoOp;
        }

        const oNode = oNodes[0];

        if (!this.hasGenerator(oNode)) {
            console.warn(
                `WARNING: Attemped to generate statement code for output ${outputIndex} of ${node.title} but output node was not registered with the JavaScript generator for code generation.`
            );
            return JavaScriptConstantStrings.NoOp;
        }

        finalCode = this.executeGeneratorFunction(oNode)!;

        finalCode += `\n${this.walkDownStream(oNode)}`;

        return (node.indentExec ? this.indent(finalCode) : finalCode).trimEnd();
    }

    /**
     * Walk down all the "Exec" path
     * @param node The starting node
     */
    walkDownStream(node: BaseNode) {
        const code: string[] = [];

        const visited = new Set<number>();

        let processingNode = this.getExecOutputNode(node);

        while (processingNode) {
            // safe guard against possible infinite loop in case graph contains a circle
            if (visited.has(processingNode.id))
                throw new GenerationError(
                    "Unable to generate graph code as it contains circular dependencies.",
                    GenerationErrorType.CircularDependency
                );
            visited.add(processingNode.id);

            if (!this.hasGenerator(processingNode)) {
                console.log(
                    `WARNING: Node ${processingNode.title} does not have a generator function`
                );
                code.push(JavaScriptConstantStrings.NoOp);
                continue;
            }

            code.push(this.executeGeneratorFunction(processingNode)!);

            processingNode = this.getExecOutputNode(processingNode);
        }

        return code.join("\n");
    }

    isGhostNode(node: BaseNode) {
        if (node.isAnyOutputConnected()) return false;

        for (const input of node.inputs) {
            if (input.link) return false;
        }
    }

    graphToCode(graph: LGraph): { code: string; meta: string, intents: string[] } {
        let codeString: string[] = [];

        // @ts-expect-error need to get all nodes. Could not find any public API to do so (even though there should be one there)
        const nodes = graph._nodes as BaseNode[];

        // filter all the 'roots'
        const roots = nodes.filter((node) => {
            // filter and create import statements at the same time.
            if (!this.isGhostNode(node)) {
                this.collectImports(node);
				this.collectIntents(node);
            }
            return node instanceof RootNode;
        });

        if (roots.length === 0) throw new GenerationError("Node roots were found in the graph.");

        const defaultRootIndex = roots.findIndex((node) => node instanceof OnProgramStartNode);

        if (defaultRootIndex === -1)
            throw new GenerationError("No 'On Program Start' root node found in the graph.");

        const defaultRoot = roots.splice(defaultRootIndex, 1)[0] as OnProgramStartNode;
        roots.unshift(defaultRoot);
        // process each root node
        for (const root of roots) {
            if (!this.hasGenerator(root)) {
                console.warn(
                    `Cannot generate code for ${root.title}. This is a root node and nothing for this branch will be generated.`
                );
                continue;
            }

            codeString.push(this.executeGeneratorFunction(root)!);
        }

        const imports = `${IMPORT_STATEMENT[0]}\n${this.generateImportStatements().join("\n").trimEnd()}\n${IMPORT_STATEMENT[1]}`;
        const initialisers = this.generateInitialiserStatements().join("\n\n");
        const cleanups = this.generateCleanUpStatements().join("\n\n");

        const jsonDeps: Record<string, string> = {};

        for (const dep of this.imports.values().filter((v) => !v.isNode)) {
			if(dep.package.startsWith("@")) {
				const packageParts = dep.package.split("/");
				const packageName = packageParts[0] + "/" + packageParts[1];
				jsonDeps[packageName] = dep.version;
			} else {
				jsonDeps[dep.package.split("/")[0]] = dep.version;
			}
        }

		jsonDeps["discord.js"] = "^14";

		const intents = ["Guilds", ...structuredClone(this.intents)].map(v => `\tDisflowDJS.GatewayIntentBits.${v}`);

        // reset all the cache
        this.imports.clear();
        this.visitedNodes.clear();
        this.codeCache.clear();
        this.initialisers.clear();
        this.cleanupCode.clear();
		this.intents.clear();

        return {
            code: `${imports}\n\n${initialisers.trimEnd()}\n\n${codeString.join("\n")}\n\n${cleanups}`,
            meta: JSON.stringify({
				name: "disflow-discord-bot",
				version: "1.0.0",
				description: "This Discord bot is generated using DisFlow. The no-code Discord bot builder",
				dependencies: jsonDeps
			}, null, "\t"),
			intents
        };
    }

	collectIntents(node: BaseNode) {
		for (const intent of node.requiredIntents) {
			if(this.intents.has(intent)) continue;
			this.intents.add(intent);
		}
	}

    // ---------- START IMPORT PROCESSING ----------
    collectImports(node: BaseNode) {
        for (const statement of node.imports) {
            if (statement.initialiser && !this.initialisers.has(statement.initialiser))
                this.initialisers.add(statement.initialiser);
            if (statement.cleanup && !this.cleanupCode.has(statement.cleanup))
                this.cleanupCode.add(statement.cleanup);

            if (statement.type === ImportType.Object) {
                const modId = `object@${statement.from}`;
                if (this.imports.has(modId)) {
                    const previousStatement = this.imports.get(modId)!;
                    const filteredModules = statement.module.filter(
                        (v) => !previousStatement.modules.includes(v)
                    );

                    previousStatement.modules.push(...filteredModules);
                    this.imports.set(modId, previousStatement);
                } else {
                    this.imports.set(modId, {
                        modules: statement.module,
                        type: statement.type,
                        version: statement.packageVersion,
                        package: statement.from,
                        isNode: statement.isFromNodeJS || false,
                    });
                }
            } else {
                const modId = `${statement.module}@${statement.from}`;

                if (this.imports.has(modId)) continue; // alraedy cached

                this.imports.set(modId, {
                    modules: [statement.module],
                    type: statement.type,
                    version: statement.packageVersion,
                    package: statement.from,
                    isNode: statement.isFromNodeJS || false,
                });
            }
        }
    }

    generateInitialiserStatements() {
        return this.initialisers.values().toArray();
    }

    generateCleanUpStatements() {
        return this.cleanupCode.values().toArray();
    }

    generateImportStatements() {
        const imports = this.imports.values();

        return imports
            .map((v) => {
                let statement = "";

                switch (v.type) {
                    case ImportType.Object: {
                        statement = `import {\n${v.modules
                            .map((s) => `\t${s}`)
                            .join("\n")
                            .trimEnd()}\n}`;
                        break;
                    }
                    case ImportType.Everything: {
                        statement = `import * as ${v.modules[0]}`;
                        break;
                    }
                    default: {
                        statement = `import ${v.modules[0]}`;
                    }
                }

                statement += ` from "${v.package}";`;

                return statement;
            })
            .toArray();
    }
}
