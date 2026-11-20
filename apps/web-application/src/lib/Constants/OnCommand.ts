import { DEFAULT_NODES } from "./DefaultNodes";
import { INTERACTION_NODES } from "./InteractionNodes";

export const COMMAND_NODES = [...DEFAULT_NODES, ...INTERACTION_NODES] as const;
