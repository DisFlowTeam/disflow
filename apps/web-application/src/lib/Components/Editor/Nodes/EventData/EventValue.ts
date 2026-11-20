import { BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const VALUES = {
	"Bot Client": "disflowClient",
	Guild: "guild",
	"Old Guild": "oldGuild",
	"New Guild": "newGuild",
	Member: "member",
	"Old Member": "oldMember",
	"New Member": "newMember",
	Channel: "channel",
	"Old Channel": "oldChannel",
	"New Channel": "newChannel",
	Message: "message",
	"Old Message": "oldMessage",
	"New Message": "newMessage",
	Messages: "messages",
	Reaction: "reaction",
	Reactions: "reactions",
	User: "user",
	"Old User": "oldUser",
	"New User": "newUser",
	"Old Presence": "oldPresence",
	"New Presence": "newPresence",
	"Old Voice State": "oldState",
	"New Voice State": "newState",
	Typing: "typing",
	Date: "date",
	Interaction: "disflowCtx",
	"Message Context": "disflowMessage",
};

/**
 * Exposes a payload value from the surrounding event callback.
 *
 * This deliberately mirrors the callback parameter names used by the event
 * roots; use it inside a handler for the matching event.
 */
export class EventValue extends BaseNode {
	static title = "Event Value";
	static category = "Event Data";
	static noFlows = true;

	protected onBuild(): void {
		this.setNodeColor(NodeCategoryColor.EventData);

		this.addProperty("value", "Guild", FlowIOTypes.String);
		this.addWidget(
			"combo",
			"Value",
			"Guild",
			(value: string) => {
				this.properties.value = value;
			},
			{
				property: "value",
				values: Object.keys(VALUES),
			},
		);

		this.addOutput("Value", FlowIOTypes.Any);
	}

	nodeToCode(): string {
		return VALUES[this.properties.value as keyof typeof VALUES] ?? "undefined";
	}
}
