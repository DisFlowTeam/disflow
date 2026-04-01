import { BaseGenerator, BaseNode, FlowIOTypes } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';

const controls = {
	'+': '+',
	'-': '-',
	'×': '*',
	'÷': '/'
};

export class Operate extends BaseNode {
	static title: string = 'Operate';
	static category: string = 'Maths';
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Maths);
		this.addInput('A', FlowIOTypes.Number);
		this.addInput('B', FlowIOTypes.Number);

		this.addProperty('A', 0, FlowIOTypes.Number);
		this.addWidget(
			'number',
			'A',
			0,
			(v) => {
				this.properties.A = v;
			},
			{
				property: 'A'
			}
		);

		this.addProperty('B', 0, FlowIOTypes.Number);
		this.addWidget(
			'number',
			'B',
			0,
			(v) => {
				this.properties.B = v;
			},
			{
				property: 'B'
			}
		);

		this.addProperty('type', '+', FlowIOTypes.String);
		this.addWidget(
			'combo',
			'Type',
			'+',
			(v) => {
				this.properties.type = v;
			},
			{
				property: 'type',
				values: Object.keys(controls)
			}
		);

		this.addOutput('Number', FlowIOTypes.Number);
	}

	nodeToCode(generator: BaseGenerator): string {
		const A = this.inputs[0].link == null ? this.properties.A : generator.valueToCode(this, 0);

		const B = this.inputs[1].link == null ? this.properties.B : generator.valueToCode(this, 1);

		return `(${A} ${controls[this.properties.type as keyof typeof controls]} ${B})`;
	}
}
