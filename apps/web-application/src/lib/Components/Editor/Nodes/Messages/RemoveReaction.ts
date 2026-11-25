import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

/**
 * Removes a reaction, either from one user or from everyone when no user is
 * connected.
 */
export class RemoveReaction extends BaseNode {
	static title = "Remove Reaction";
	static category = "Messages";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Messages);

		this.addInput("Message", FlowIOTypes.Object);
		this.addInput("Emoji", FlowIOTypes.String);
		this.addInput("User", FlowIOTypes.Object);

		this.addProperty("emoji", "👍", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Emoji",
			"👍",
			(value: string) => {
				this.properties.emoji = value;
			},
			{ property: "emoji" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const message = generator.valueToCode(this, 1);
		const emoji = inputOrText(generator, this, 2, "emoji");

		if (this.inputs[3]?.link != null) {
			const user = generator.valueToCode(this, 3);

			return `await ${message}.reactions.cache.get(${emoji})?.users.remove(${user});`;
		}

		return `await ${message}.reactions.cache.get(${emoji})?.remove();`;
	}
}
