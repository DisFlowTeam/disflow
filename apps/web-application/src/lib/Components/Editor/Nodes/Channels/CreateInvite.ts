import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { jsonOrNull } from "../helpers";

/**
 * Creates an invite. `Max Age` and `Max Uses` of `0` mean never expire and
 * unlimited uses.
 */
export class CreateInvite extends BaseNode {
	static title = "Create Invite";
	static category = "Channels";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Channel", FlowIOTypes.Object);

		this.addProperty("maxAge", 0, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Max Age (seconds)",
			0,
			(value: number) => {
				this.properties.maxAge = value;
			},
			{ property: "maxAge" },
		);

		this.addProperty("maxUses", 0, FlowIOTypes.Number);
		this.addWidget(
			"number",
			"Max Uses",
			0,
			(value: number) => {
				this.properties.maxUses = value;
			},
			{ property: "maxUses" },
		);

		this.addProperty("reason", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Reason",
			"",
			(value: string) => {
				this.properties.reason = value;
			},
			{ property: "reason" },
		);

		this.addOutput("Invite", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 0);
		const maxAge = Number(this.properties.maxAge) || 0;
		const maxUses = Number(this.properties.maxUses) || 0;
		const reason = jsonOrNull(this.properties.reason);

		return `await ${channel}.createInvite({ maxAge: ${maxAge}, maxUses: ${maxUses} }${reason ? `, ${reason}` : ""})`;
	}
}
