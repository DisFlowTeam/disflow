import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { addDatabaseImport } from "./databaseImport";

/**
 * Removes every key and writes the empty database back to disk.
 */
export class ClearDatabase extends BaseNode {
	static title = "Clear Database";
	static category = "Database";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Database);
		addDatabaseImport(this);

		this.addInput("Database", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const database = generator.valueToCode(this, 1);

		return `${database}.clear();`;
	}
}
