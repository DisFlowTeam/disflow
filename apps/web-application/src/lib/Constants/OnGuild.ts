import * as ChannelNodes from "../Components/Editor/Nodes/Channels";
import * as MemberNodes from "../Components/Editor/Nodes/Members";
import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import { toObjectValues } from "./DefaultNodes";

export const GUILD_NODES = [
	...toObjectValues(ChannelNodes),
	...toObjectValues(MemberNodes),
	...toObjectValues(MessageNodes),
] as const;
