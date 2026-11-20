import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import * as OnMessageNodes from "../Components/Editor/Nodes/OnMessage";
import { toObjectValues } from "./DefaultNodes";

export const MESSAGE_NODES = [
	...toObjectValues(OnMessageNodes),
	...toObjectValues(MessageNodes),
] as const;

export const MESSAGE_ACTION_NODES = [...toObjectValues(MessageNodes)] as const;
