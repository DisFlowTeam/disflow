import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const MODES = {
	"Date object": "new Date()",
	"Timestamp (ms)": "Date.now()",
	"ISO string": "new Date().toISOString()",
} as const;

export class CurrentTime extends BaseNode {
	static title = "Current Time";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addProperty("mode", "Date object", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Output",
			"Date object",
			(value: string) => {
				this.properties.mode = value;
			},
			{ property: "mode", values: Object.keys(MODES) },
		);

		this.addOutput("Time", FlowIOTypes.Any);
	}

	nodeToCode(): string {
		return (
			MODES[this.properties.mode as keyof typeof MODES] ?? MODES["Date object"]
		);
	}
}
