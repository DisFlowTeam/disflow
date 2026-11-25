import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";
import { addDatabaseImport } from "./databaseImport";

export class SetValue extends BaseNode {
	static title = "Set Value";
	static category = "Database";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Database);
		addDatabaseImport(this);

		this.addInput("Database", FlowIOTypes.Object);
		this.addInput("Key", FlowIOTypes.String);
		this.addInput("Value", FlowIOTypes.Any);

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

		this.addProperty("value", "value", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Value",
			"value",
			(value: string) => {
				this.properties.value = value;
			},
			{ property: "value" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const database = generator.valueToCode(this, 1);
		const key = inputOrText(generator, this, 2, "key");
		const value = inputOrText(generator, this, 3, "value");

		return `${database}.set(${key}, ${value});`;
	}
}
