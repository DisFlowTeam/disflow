import { MessageAuthor } from "./Messages/MessageAuthor";
import { MessageContent } from "./Messages/MessageContent";
import type { NodeClass } from "./types";

/** Type names used by graphs saved before the Message/Messages merge. */
export const LEGACY_NODE_TYPES: [string, NodeClass][] = [
	["Message/Message Author", MessageAuthor],
	["Message/Message Content", MessageContent],
];
