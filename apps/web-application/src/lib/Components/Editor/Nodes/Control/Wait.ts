import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrNumber } from "../helpers";

/**
 * Pauses the current handler. Useful for cooldowns and multi-step flows.
 */
export class Wait extends BaseNode {
	static title = "Wait";
	static category = "Control";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);

		this.addInput("Milliseconds", FlowIOTypes.Number);

		this.addProperty("milliseconds", 1000, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Milliseconds",
			1000,
			(value: number) => {
				this.properties.milliseconds = value;
			},
			{ property: "milliseconds" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const milliseconds = inputOrNumber(
			generator,
			this,
			1,
			"milliseconds",
			1000,
		);

		return `await new Promise((disflowResolve) => setTimeout(disflowResolve, ${milliseconds}));`;
	}
}
