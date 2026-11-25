import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { addDatabaseImport } from "./databaseImport";

/**
 * Returns every entry as an array of `{ key, data }` objects.
 */
export class GetAllEntries extends BaseNode {
	static title = "Get All Entries";
	static category = "Database";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Database);
		addDatabaseImport(this);

		this.addInput("Database", FlowIOTypes.Object);

		this.addOutput("Entries", FlowIOTypes.Array);
	}

	nodeToCode(generator: BaseGenerator): string {
		const database = generator.valueToCode(this, 0);

		return `${database}.all()`;
	}
}
