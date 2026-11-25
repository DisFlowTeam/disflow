import * as MessageNodes from "../Components/Editor/Nodes/Messages";
import { toObjectValues } from "./DefaultNodes";

export const TYPING_NODES = [...toObjectValues(MessageNodes)] as const;
