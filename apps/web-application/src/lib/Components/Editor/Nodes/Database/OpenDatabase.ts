import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";
import { addDatabaseImport } from "./databaseImport";

/**
 * Creates a JSON database handle.
 *
 * The library loads the file when an instance is created and writes it back
 * synchronously on every mutation, so each operation can safely construct its
 * own handle. Paths are relative to the generated bot's working directory.
 */
export class OpenDatabase extends BaseNode {
	static title = "Open Database";
	static category = "Database";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Database);
		addDatabaseImport(this);

		this.addInput("Path", FlowIOTypes.String);

		this.addProperty("path", "./db.json", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Path",
			"./db.json",
			(value: string) => {
				this.properties.path = value;
			},
			{ property: "path" },
		);

		this.addOutput("Database", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const path = inputOrText(generator, this, 0, "path");

		return `new DisFlowDB(${path})`;
	}
}
