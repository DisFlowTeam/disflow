import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

/**
 * Waits for the next button click in the interaction's channel and returns
 * that interaction.
 *
 * This is a value node, so the surrounding handler is paused while waiting.
 * The optional custom id filters which button is accepted.
 */
export class AwaitButtonClick extends BaseNode {
	static title = "Await Button Click";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);
		this.addInput("Custom ID", FlowIOTypes.String);

		this.addProperty("customId", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Custom ID",
			"",
			(value: string) => {
				this.properties.customId = value;
			},
			{ property: "customId" },
		);

		this.addProperty("timeout", 30, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Timeout (seconds)",
			30,
			(value: number) => {
				this.properties.timeout = value;
			},
			{ property: "timeout" },
		);

		this.addOutput("Interaction", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 0);
		const customId = inputOrText(generator, this, 1, "customId");
		const hasCustomId =
			this.inputs[1].link != null ||
			String(this.properties.customId ?? "").trim().length > 0;
		const timeout = Math.max(1, Number(this.properties.timeout) || 30) * 1000;

		const filter = hasCustomId
			? `, filter: (disflowComponent) => disflowComponent.customId === ${customId}`
			: "";

		return `await ${interaction}.channel.awaitMessageComponent({ componentType: DisFlowDJS.ComponentType.Button, time: ${timeout}${filter} })`;
	}
}
