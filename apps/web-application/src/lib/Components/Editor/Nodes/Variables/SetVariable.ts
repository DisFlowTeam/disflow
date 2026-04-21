import { BaseGenerator, BaseNode, FlowIOTypes } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';

export class SetVariable extends BaseNode {
	static title: string = 'Set Variable';
	static category: string = 'Variables';

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Variables);
		this.addProperty('name', 'Name', FlowIOTypes.String);
		this.addWidget(
			'text',
			'Name',
			'myVariable',
			(v: string) => {
				this.properties.name = v;
			},
			{
				property: 'name'
			}
		);
		this.addInput('Value', FlowIOTypes.Any);
	}

	nodeToCode(generator: BaseGenerator): string {
		const value = this.inputs[1].link == null ? `undefined` : generator.valueToCode(this, 1);
		return `${this.properties.name} = ${value};`;
	}
}
