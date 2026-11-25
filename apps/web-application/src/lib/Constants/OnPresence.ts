import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import { toObjectValues } from "./DefaultNodes";

export const PRESENCE_NODES = [...toObjectValues(MessageNodes)] as const;
