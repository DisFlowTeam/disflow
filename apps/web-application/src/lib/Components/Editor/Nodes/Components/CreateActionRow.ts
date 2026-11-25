import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

/**
 * Groups components into a discord.js `ActionRowBuilder`.
 *
 * Discord allows up to five components per row, so the node exposes five
 * optional inputs. Connected inputs are added in order.
 */
export class CreateActionRow extends BaseNode {
	static title = "Create Action Row";
	static category = "Components";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Components);

		for (let i = 1; i <= 5; i++) {
			this.addInput(`Component ${i}`, FlowIOTypes.Any);
		}

		this.addOutput("Row", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const components: string[] = [];

		for (let i = 0; i < this.inputs.length; i++) {
			if (this.inputs[i].link == null) continue;

			components.push(generator.valueToCode(this, i));
		}

		const base = "new DisFlowDJS.ActionRowBuilder()";

		return components.length > 0
			? `${base}.addComponents(${components.join(", ")})`
			: base;
	}
}
