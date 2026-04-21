import { BaseNode, FlowIOTypes, BaseGenerator } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';
import { LiteGraph } from 'litegraph.js';

export class ReverseText extends BaseNode {
	static title: string = 'Reverse Text';
	static category: string = 'Text Tools';
	static noFlows: boolean = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.TextTools);
		this.addInput('Text', FlowIOTypes.Any);
		this.addOutput('Text', FlowIOTypes.String);

		this.addProperty('txt', 'Your Text', FlowIOTypes.String);
		this.addWidget(
			'text',
			'In Text',
			'Your Text',
			(v: string) => {
				this.properties.txt = v;
			},
			{
				property: 'txt'
			}
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		let txt;

		if (this.inputs[0].link != null && this.getInputDataType(0) == FlowIOTypes.String) {
			txt = generator.valueToCode(this, 0);
		} else {
			txt =
				this.inputs[0].link == null
					? JSON.stringify(this.properties.txt)
					: `String(${generator.valueToCode(this, 0)})`;
		}

		return `${txt}.split('').reverse().join('')`;
	}
}
