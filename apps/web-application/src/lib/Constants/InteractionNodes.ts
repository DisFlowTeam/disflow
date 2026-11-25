import * as InteractionNodes from "../Components/Editor/Nodes/Interaction";
import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import { toObjectValues } from "./DefaultNodes";

export const INTERACTION_NODES = [
	...toObjectValues(InteractionNodes),
	...toObjectValues(MessageNodes),
] as const;
