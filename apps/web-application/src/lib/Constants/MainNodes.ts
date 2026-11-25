import * as ConsoleNodes from "../Components/Editor/Nodes/Console";
import * as ControlNodes from "../Components/Editor/Nodes/Control";
import * as DataNodes from "../Components/Editor/Nodes/Data";
import * as DatabaseNodes from "../Components/Editor/Nodes/Database";
import * as DiscordNodes from "../Components/Editor/Nodes/Discord";
import * as EmbedNodes from "../Components/Editor/Nodes/Embeds";
import * as MathsNodes from "../Components/Editor/Nodes/Math";
import * as StringNodes from "../Components/Editor/Nodes/Strings";
import * as VariableNodes from "../Components/Editor/Nodes/Variables";
import { toObjectValues } from "./DefaultNodes";

/**
 * Nodes that make sense in the bot's main file.
 * These are 'safe' nodes which doesn't need any event-based values
 * so the user can't accidently 'screw up' an undefined value
 */
export const MAIN_NODES = [
	...toObjectValues(ConsoleNodes),
	...toObjectValues(ControlNodes),
	...toObjectValues(DataNodes),
	...toObjectValues(DatabaseNodes),
	...toObjectValues(DiscordNodes),
	...toObjectValues(EmbedNodes),
	...toObjectValues(MathsNodes),
	...toObjectValues(StringNodes),
	...toObjectValues(VariableNodes),
] as const;
