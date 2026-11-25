import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { toIdentifier } from "../helpers";

/**
 * Loops over an array.
 *
 * The current element is exposed as a block-scoped variable named by the
 * `Item Name` widget. Reference it inside the body with a `Variable` node that
 * uses the same name.
 */
export class ForEach extends BaseNode {
	static title = "For Each";
	static category = "Control";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);

		this.addInput("List", FlowIOTypes.Array);

		this.addProperty("itemName", "item", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Item Name",
			"item",
			(value: string) => {
				this.properties.itemName = value;
			},
			{
				property: "itemName",
				sanitize: toIdentifier,
				sanitizeLabel: "Item name",
			},
		);

		this.addOutput("Run", FlowIOTypes.Flow);
	}

	nodeToCode(generator: BaseGenerator): string {
		// Exec is input 0, so the list is input 1. The loop body is the first
		// output declared in onBuild, which is output 1.
		const list =
			this.inputs[1].link == null ? "[]" : generator.valueToCode(this, 1);
		const name = toIdentifier(this.properties.itemName, "item");
		const body = generator.statementToCode(this, 1);

		return `for (const ${name} of (${list} ?? [])) {\n${body}\n}`;
	}
}
