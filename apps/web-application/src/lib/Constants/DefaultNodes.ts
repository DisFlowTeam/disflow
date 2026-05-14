import * as ConsoleNodes from "../Components/Editor/Nodes/Console";
import * as ControlNodes from "../Components/Editor/Nodes/Control";
import * as MathsNodes from "../Components/Editor/Nodes/Math";
import * as StringNodes from "../Components/Editor/Nodes/Strings";
import * as VariableNodes from "../Components/Editor/Nodes/Variables";

export function toObjectValues<T>(object: Record<string, T>): T[] {
    return Object.keys(object).map(key => object[key]);
}

export const DEFAULT_NODES = [
    ...toObjectValues(ConsoleNodes),
    ...toObjectValues(ControlNodes),
    ...toObjectValues(MathsNodes),
    ...toObjectValues(StringNodes),
    ...toObjectValues(VariableNodes)
] as const;