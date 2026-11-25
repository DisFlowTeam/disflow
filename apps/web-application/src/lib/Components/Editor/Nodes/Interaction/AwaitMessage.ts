import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { jsonOrNull } from "../helpers";

/**
 * Waits for the next message in a channel and returns it.
 *
 * An optional prefix restricts the accepted messages, which makes it suitable
 * for simple "reply with your answer" flows.
 */
export class AwaitMessage extends BaseNode {
	static title = "Await Message";
	static category = "Interaction";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Starts With", FlowIOTypes.String);

		this.addProperty("prefix", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Starts With",
			"",
			(value: string) => {
				this.properties.prefix = value;
			},
			{ property: "prefix" },
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

		this.addOutput("Message", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 0);
		const prefix =
			this.inputs[1].link != null
				? generator.valueToCode(this, 1)
				: jsonOrNull(this.properties.prefix);
		const timeout = Math.max(1, Number(this.properties.timeout) || 30) * 1000;

		const filter = prefix
			? `, filter: (disflowMessage) => disflowMessage.content.startsWith(${prefix})`
			: "";

		return `await ${channel}.awaitMessages({ max: 1, time: ${timeout}${filter} }).then((disflowCollected) => disflowCollected.first())`;
	}
}
