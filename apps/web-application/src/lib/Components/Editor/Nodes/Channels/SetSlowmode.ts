import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrNumber } from "../helpers";

/**
 * Sets a text channel's slowmode. `0` disables it.
 */
export class SetSlowmode extends BaseNode {
	static title = "Set Slowmode";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Seconds", FlowIOTypes.Number);

		this.addProperty("seconds", 5, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Seconds",
			5,
			(value: number) => {
				this.properties.seconds = value;
			},
			{ property: "seconds" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const seconds = inputOrNumber(generator, this, 2, "seconds", 5);

		return `await ${channel}.setRateLimitPerUser(${seconds});`;
	}
}
