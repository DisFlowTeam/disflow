import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import {
	Message,
	MessageAuthor,
	MessageContent,
} from "../Components/Editor/Nodes/Messages";
import type { NodeClass } from "../Components/Editor/Nodes/types";
import { toObjectValues } from "./DefaultNodes";

const MESSAGE_EVENT_DATA_NODES: NodeClass[] = [
	Message,
	MessageAuthor,
	MessageContent,
];

export const MESSAGE_ACTION_NODES = toObjectValues(MessageNodes).filter(
	(node) => !MESSAGE_EVENT_DATA_NODES.includes(node),
);

export const MESSAGE_NODES = [
	...MESSAGE_ACTION_NODES,
	...MESSAGE_EVENT_DATA_NODES,
] as const;
