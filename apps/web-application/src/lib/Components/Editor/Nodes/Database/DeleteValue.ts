import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";
import { addDatabaseImport } from "./databaseImport";

export class DeleteValue extends BaseNode {
	static title = "Delete Value";
	static category = "Database";

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
	}

	nodeToCode(generator: BaseGenerator): string {
		const database = generator.valueToCode(this, 1);
		const key = inputOrText(generator, this, 2, "key");

		return `${database}.delete(${key});`;
	}
}
