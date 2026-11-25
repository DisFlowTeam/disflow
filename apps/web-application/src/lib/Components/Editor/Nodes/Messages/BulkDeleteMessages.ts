import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrNumber } from "../helpers";

/**
 * Deletes the most recent messages in a channel.
 *
 * `Filter Old` skips messages older than two weeks, which Discord refuses to
 * bulk delete.
 */
export class BulkDeleteMessages extends BaseNode {
	static title = "Bulk Delete Messages";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Amount", FlowIOTypes.Number);

		this.addProperty("amount", 10, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Amount",
			10,
			(value: number) => {
				this.properties.amount = value;
			},
			{ property: "amount" },
		);

		this.addProperty("filterOld", true, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Filter Old",
			true,
			(value: boolean) => {
				this.properties.filterOld = value;
			},
			{ property: "filterOld" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const amount = inputOrNumber(generator, this, 2, "amount", 10);

		return `await ${channel}.bulkDelete(${amount}, ${this.properties.filterOld !== false});`;
	}
}
