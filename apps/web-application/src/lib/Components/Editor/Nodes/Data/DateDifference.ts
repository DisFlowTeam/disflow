import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const UNITS = {
	Milliseconds: 1,
	Seconds: 1000,
	Minutes: 60_000,
	Hours: 3_600_000,
	Days: 86_400_000,
} as const;

export class DateDifference extends BaseNode {
	static title = "Date Difference";
	static category = "Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Data);

		this.addInput("Date A", FlowIOTypes.Any);
		this.addInput("Date B", FlowIOTypes.Any);

		this.addProperty("unit", "Days", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Unit",
			"Days",
			(value: string) => {
				this.properties.unit = value;
			},
			{ property: "unit", values: Object.keys(UNITS) },
		);

		this.addOutput("Difference", FlowIOTypes.Number);
	}

	nodeToCode(generator: BaseGenerator): string {
		const a =
			this.inputs[0].link == null
				? "Date.now()"
				: generator.valueToCode(this, 0);
		const b =
			this.inputs[1].link == null
				? "Date.now()"
				: generator.valueToCode(this, 1);
		const unit =
			UNITS[this.properties.unit as keyof typeof UNITS] ?? UNITS.Days;

		return `Math.round(Math.abs(new Date(${a}).getTime() - new Date(${b}).getTime()) / ${unit})`;
	}
}
