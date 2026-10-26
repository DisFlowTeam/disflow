import { toObjectValues } from "./DefaultNodes";
import * as OnMessageNodes from "../Components/Editor/Nodes/OnMessage";

export const MESSAGE_NODES = [
	...toObjectValues(OnMessageNodes),
] as const;