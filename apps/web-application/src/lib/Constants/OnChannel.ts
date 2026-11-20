import * as ChannelNodes from "../Components/Editor/Nodes/Channels";
import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import { toObjectValues } from "./DefaultNodes";

export const CHANNEL_NODES = [
	...toObjectValues(ChannelNodes),
	...toObjectValues(MessageNodes),
] as const;
