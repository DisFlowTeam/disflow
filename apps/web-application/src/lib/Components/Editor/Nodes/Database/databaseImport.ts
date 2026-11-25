import type { BaseNode } from "@disflow-team/code-gen";
import { ImportType } from "@disflow-team/code-gen";

export const DATABASE_PACKAGE = "easy-json-database";
export const DATABASE_VERSION = "^1.5.1";

/**
 * Declare the JSON database dependency.
 *
 * Every database node calls this so the import and the generated
 * `package.json` entry survive even when the graph is assembled per event or
 * per command file. The import id is stable, so the generator only emits one
 * import statement.
 */
export function addDatabaseImport(node: BaseNode) {
	node.addImport({
		type: ImportType.Default,
		module: "DisFlowDB",
		from: DATABASE_PACKAGE,
		packageVersion: DATABASE_VERSION,
	});
}
