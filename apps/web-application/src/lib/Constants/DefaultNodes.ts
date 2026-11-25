import * as ComponentNodes from "../Components/Editor/Nodes/Components";
import * as ConsoleNodes from "../Components/Editor/Nodes/Console";
import * as ControlNodes from "../Components/Editor/Nodes/Control";
import * as DataNodes from "../Components/Editor/Nodes/Data";
import * as DatabaseNodes from "../Components/Editor/Nodes/Database";
import * as DiscordNodes from "../Components/Editor/Nodes/Discord";
import * as EmbedNodes from "../Components/Editor/Nodes/Embeds";
import * as EventDataNodes from "../Components/Editor/Nodes/EventData";
import * as MathsNodes from "../Components/Editor/Nodes/Math";
import * as StringNodes from "../Components/Editor/Nodes/Strings";
import * as VariableNodes from "../Components/Editor/Nodes/Variables";

export function toObjectValues<T>(object: Record<string, T>): T[] {
	return Object.keys(object).map((key) => object[key]);
}

export const DEFAULT_NODES = [
	...toObjectValues(ComponentNodes),
	...toObjectValues(ConsoleNodes),
	...toObjectValues(ControlNodes),
	...toObjectValues(DataNodes),
	...toObjectValues(DatabaseNodes),
	...toObjectValues(DiscordNodes),
	...toObjectValues(EmbedNodes),
	...toObjectValues(EventDataNodes),
	...toObjectValues(MathsNodes),
	...toObjectValues(StringNodes),
	...toObjectValues(VariableNodes),
] as const;
