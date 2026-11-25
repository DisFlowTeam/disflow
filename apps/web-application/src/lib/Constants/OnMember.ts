import * as MemberNodes from "../Components/Editor/Nodes/Members";
import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import { toObjectValues } from "./DefaultNodes";

export const MEMBER_NODES = [
	...toObjectValues(MemberNodes),
	...toObjectValues(MessageNodes),
] as const;
