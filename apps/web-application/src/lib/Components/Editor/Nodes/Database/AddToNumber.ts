import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrNumber, inputOrText } from "../helpers";
import { addDatabaseImport } from "./databaseImport";

/**
 * Increments a numeric key. Missing keys start at `0`, matching the library.
 */
export class AddToNumber extends BaseNode {
	static title = "Add To Number";
	static category = "Database";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Database);
		addDatabaseImport(this);

		this.addInput("Database", FlowIOTypes.Object);
		this.addInput("Key", FlowIOTypes.String);
		this.addInput("Amount", FlowIOTypes.Number);

		this.addProperty("key", "counter", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Key",
			"counter",
			(value: string) => {
				this.properties.key = value;
			},
			{ property: "key" },
		);

		this.addProperty("amount", 1, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Amount",
			1,
			(value: number) => {
				this.properties.amount = value;
			},
			{ property: "amount" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const database = generator.valueToCode(this, 1);
		const key = inputOrText(generator, this, 2, "key");
		const amount = inputOrNumber(generator, this, 3, "amount", 1);

		return `${database}.add(${key}, ${amount});`;
	}
}
