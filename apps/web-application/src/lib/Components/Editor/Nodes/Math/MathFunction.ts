import { BaseGenerator, BaseNode, FlowIOTypes } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';

const CAPTURE = '%{{DISFLOW_CODE_MATH_FUNC}}';

const codes = {
	'square root': `Math.sqrt(${CAPTURE})`,
	absolute: `Math.abs(${CAPTURE})`,
	'-': `-Math.abs(${CAPTURE})`,
	ln: `Math.log(${CAPTURE})`,
	log10: `Math.log10(${CAPTURE})`,
	'e^': `Math.exp(${CAPTURE})`,
	'10^': `Math.pow(10, ${CAPTURE})`
} as const;

export class MathFunctions extends BaseNode {
	static title: string = 'MathFunctions';
	static category: string = 'Maths';
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Maths);

		this.addInput('Input', FlowIOTypes.Number);
		this.addOutput('Output', FlowIOTypes.Number);

		this.addProperty('value', 0, FlowIOTypes.Number);
		this.addWidget(
			'number',
			'Number',
			0,
			(value) => {
				this.properties.value = value;
			},
			{ property: 'value' }
		);

		this.addProperty('type', 'square root', FlowIOTypes.String);
		this.addWidget(
			'combo',
			'operation',
			'square root',
			(type) => {
				this.properties.type = type;
			},
			{
				property: 'type',
				values: Object.keys(codes)
			}
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const op = this.properties.type as keyof typeof codes;
		const num =
			this.inputs[0].link === null ? this.properties.value : generator.valueToCode(this, 0);

		return codes[op].replace(CAPTURE, num);
	}
}
