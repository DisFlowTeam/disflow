import { BaseGenerator, BaseNode, FlowIOTypes } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';

export class ThrowError extends BaseNode {
	static title: string = 'Throw Error';
	static category: string = 'Console';

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Console);
		this.addInput('Content', FlowIOTypes.Any);
		this.addProperty('content', 'Your Error', FlowIOTypes.String);

		this.addWidget(
			'text',
			'Content',
			'Your Error',
			(v: string) => {
				this.properties.content = v;
			},
			{
				property: 'content'
			}
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const error =
			this.inputs[1].link == null
				? JSON.stringify(this.properties.content)
				: generator.valueToCode(this, 1);

		return `throw ${error};`;
	}
}
