import {
	type BaseGenerator,
	BaseNode,
	FlowIOTypes,
} from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";
import { jsonOrNull } from "../helpers";

/**
 * Edits a channel permission overwrite for a role or member.
 *
 * Permission names are discord.js `PermissionOverwriteOptions` keys, for
 * example `ViewChannel, SendMessages, ReadMessageHistory`. The same names are
 * allowed or denied depending on the toggle.
 */
export class SetChannelPermissions extends BaseNode {
	static title = "Set Channel Permissions";
	static category = "Channels";

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.Channels);

		this.addInput("Channel", FlowIOTypes.Object);
		this.addInput("Role or Member", FlowIOTypes.Object);

		this.addProperty("permissions", "ViewChannel", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Permissions",
			"ViewChannel",
			(value: string) => {
				this.properties.permissions = value;
			},
			{ property: "permissions" },
		);

		this.addProperty("allow", true, FlowIOTypes.Boolean);
		this.addWidget(
			"toggle",
			"Allow",
			true,
			(value: boolean) => {
				this.properties.allow = value;
			},
			{ property: "allow" },
		);

		this.addProperty("reason", "", FlowIOTypes.String);
		this.addWidget(
			"text",
			"Reason",
			"",
			(value: string) => {
				this.properties.reason = value;
			},
			{ property: "reason" },
		);
	}

	nodeToCode(generator: BaseGenerator): string {
		const channel = generator.valueToCode(this, 1);
		const target = generator.valueToCode(this, 2);

		const permissions = String(this.properties.permissions ?? "")
			.split(",")
			.map((permission) => permission.trim())
			.filter(Boolean);

		if (permissions.length === 0) {
			return "// Select at least one permission for Set Channel Permissions.";
		}

		const allow = this.properties.allow !== false;
		const entries = permissions
			.map((permission) => `${permission}: ${allow}`)
			.join(", ");
		const reason = jsonOrNull(this.properties.reason);

		return `await ${channel}.permissionOverwrites.edit(${target}, { ${entries} }${reason ? `, { reason: ${reason} }` : ""});`;
	}
}
