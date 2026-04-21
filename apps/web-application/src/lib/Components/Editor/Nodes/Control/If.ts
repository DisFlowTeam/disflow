import { BaseGenerator, BaseNode, FlowIOTypes } from '@disflow-team/code-gen';
import { NodeCategoryColor } from '../Colors';

export class If extends BaseNode {
	static title = 'If';
	static category = 'Control';

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Control);

		// condition input
		this.addInput('Condition', FlowIOTypes.Boolean);

		// flow outputs
		this.addOutput('Then', FlowIOTypes.Flow);

		// optional else
		this.addProperty('useElse', false, FlowIOTypes.Boolean);

		this.addWidget('toggle', 'Use Else', this.properties.useElse, (value) => {
			this.properties.useElse = value as boolean;
			this.updateElseOutput();
		});
	}

	updateElseOutput() {
		const hasElse = this.outputs.some((o) => o.name === 'Else');

		if (this.properties.useElse && !hasElse) {
			this.addOutput('Else', FlowIOTypes.Flow);
		}

		if (!this.properties.useElse && hasElse) {
			const index = this.outputs.findIndex((o) => o.name === 'Else');
			if (index !== -1) this.removeOutput(index);
		}
	}

	nodeToCode(generator: BaseGenerator): string {
		const condition = generator.valueToCode(this, 1);

		let code = `if (${condition}) {\n`;
		code += generator.statementToCode(this, 1);
		code += `\n}`;

		if (this.properties.useElse && this.outputs.some((o) => o.name === 'Else')) {
			code += ` else {\n`;
			code += generator.statementToCode(this, 2);
			code += `\n}`;
		}

		return code;
	}
}
