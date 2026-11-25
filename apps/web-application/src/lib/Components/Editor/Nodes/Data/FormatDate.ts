import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const FORMATS = {
	ISO: (date: string) => `new Date(${date}).toISOString()`,
	"Local date and time": (date: string) => `new Date(${date}).toLocaleString()`,
	"Date only": (date: string) => `new Date(${date}).toLocaleDateString()`,
	"Time only": (date: string) => `new Date(${date}).toLocaleTimeString()`,
	"Discord timestamp": (date: string) =>
		`\`<t:\${Math.floor(new Date(${date}).getTime() / 1000)}:F>\``,
	"Discord relative": (date: string) =>
		`\`<t:\${Math.floor(new Date(${date}).getTime() / 1000)}:R>\``,
} as const;

/**
 * Formats a date. Accepts a Date, a timestamp or an ISO string, and can emit
 * Discord's `<t:...>` timestamp markup.
 */
export class FormatDate extends BaseNode {
	static title = "Format Date";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("Date", FlowIOTypes.Any);

		this.addProperty("format", "Discord timestamp", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Format",
			"Discord timestamp",
			(value: string) => {
				this.properties.format = value;
			},
			{ property: "format", values: Object.keys(FORMATS) },
		);

		this.addOutput("Text", FlowIOTypes.String);
	}

	nodeToCode(generator: BaseGenerator): string {
		const date =
			this.inputs[0].link == null
				? "Date.now()"
				: generator.valueToCode(this, 0);
		const format =
			FORMATS[this.properties.format as keyof typeof FORMATS] ??
			FORMATS["Discord timestamp"];

		return format(date);
	}
}
