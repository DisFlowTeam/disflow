import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { inputOrText } from "../helpers";

const LOOKUPS = {
	"By ID": null,
	"By Username": "disflowMember.user.username",
	"By Display Name": "disflowMember.displayName",
} as const;

/**
 * Resolves a member so Kick/Ban/Role nodes can be used from events that do not
 * carry a member object.
 *
 * Lookups by username or display name search the cache, so the member must
 * already be cached (for example through the Guild Members intent).
 */
export class FindMember extends BaseNode {
	static title = "Find Member";
	static category = "Members";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Members);

		this.addInput("Guild", FlowIOTypes.Object);
		this.addInput("Query", FlowIOTypes.String);

		this.addProperty("query", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Query",
			"",
			(value: string) => {
				this.properties.query = value;
			},
			{ property: "query" },
		);

		this.addProperty("lookup", "By ID", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Lookup",
			"By ID",
			(value: string) => {
				this.properties.lookup = value;
			},
			{ property: "lookup", values: Object.keys(LOOKUPS) },
		);

		this.addOutput("Member", FlowIOTypes.Object);
	}

	nodeToCode(generator: BaseGenerator): string {
		const guild = generator.valueToCode(this, 0);
		const query = inputOrText(generator, this, 1, "query");
		const lookup =
			LOOKUPS[this.properties.lookup as keyof typeof LOOKUPS] ?? null;

		if (lookup === null) return `await ${guild}.members.fetch(${query})`;

		return `${guild}.members.cache.find((disflowMember) => ${lookup} === ${query})`;
	}
}
