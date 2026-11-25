import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

/**
 * Fetches a user by id, which is how `Send DM` reaches a user that is not part
 * of the current event payload.
 */
export class FetchUser extends BaseNode {
	static title = "Fetch User";
	static category = "Discord";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Discord);

		this.addInput("User ID", FlowIOTypes.String);

		this.addProperty("userId", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"User ID",
			"",
			(value: string) => {
				this.properties.userId = value;
			},
			{ property: "userId" },
		);

		this.addOutput("User", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const userId = inputOrText(generator, this, 0, "userId");

		return `await disflowClient.users.fetch(${userId})`;
	}
}
