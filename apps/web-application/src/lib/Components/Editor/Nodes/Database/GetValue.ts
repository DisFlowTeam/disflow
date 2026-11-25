import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";
import { addDatabaseImport } from "./databaseImport";

/**
 * Reads a key. Returns `undefined` when the key does not exist; use `Has Key`
 * first if you need to branch on that.
 */
export class GetValue extends BaseNode {
	static title = "Get Value";
	static category = "Database";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Database);
		addDatabaseImport(this);

		this.addInput("Database", FlowIOTypes.Object);
		this.addInput("Key", FlowIOTypes.String);

		this.addProperty("key", "key", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Key",
			"key",
			(value: string) => {
				this.properties.key = value;
			},
			{ property: "key" },
		);

		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const database = generator.valueToCode(this, 0);
		const key = inputOrText(generator, this, 1, "key");

		return `${database}.get(${key})`;
	}
}
