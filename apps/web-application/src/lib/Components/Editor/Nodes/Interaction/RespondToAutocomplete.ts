import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { parseChoices } from "../helpers";

/**
 * Answers an autocomplete interaction. Choices are written as
 * `Name=value, Other=other` and are usually built from `Get Focused Option`.
 */
export class RespondToAutocomplete extends BaseNode {
	static title = "Respond To Autocomplete";
	static category = "Interaction";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Interaction);

		this.addInput("Interaction", FlowIOTypes.Object);

		this.addProperty("choices", "One=one, Two=two", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Choices",
			"One=one, Two=two",
			(value: string) => {
				this.properties.choices = value;
			},
			{ property: "choices" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const interaction = generator.valueToCode(this, 1);
		const choices = parseChoices(this.properties.choices)
			.map(
				(choice) =>
					`{ name: ${JSON.stringify(choice.name)}, value: ${JSON.stringify(choice.value)} }`,
			)
			.join(", ");

		return `await ${interaction}.respond([${choices}]);`;
	}
}
