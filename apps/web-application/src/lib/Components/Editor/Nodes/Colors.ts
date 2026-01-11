import { FlowIOTypes } from "@disflow-team/code-gen";
import { LiteGraph } from "litegraph.js";

LiteGraph.NODE_TEXT_COLOR = "#FFFFFF";
LiteGraph.NODE_TITLE_COLOR = "#FFFFFF";
LiteGraph.NODE_DEFAULT_BOXCOLOR = "#0E0E0E";
LiteGraph.NODE_DEFAULT_BGCOLOR = "#1A1A1A";
LiteGraph.EVENT_LINK_COLOR = "#FFFFFF";
LiteGraph.LINK_COLOR = "#CFCFCF";

export enum NodeCategoryColor {
    Events = "#C83A3A",
    Variables = "#8E5ACF",
    Control = "#3F7FCC",
    Console = "#2FA59A",
    Maths = "#2FBF73",
    TextTools = "#C97A2B"
}

export enum FlowIOColor {
    String = "#F29E4C",
    Number = "#3DDC84",
    Object = "#4C8DFF",
    Array = "#A66BFF",
    Any = "#9CA3AF",
    Boolean = "#FF5C5C",
    Flow = "#E5484D"
}
  