export const FlowIOTypes = {
    String: "string",
    Number: "number",
    Object: "object",
    Array: "array",
    Any: "*",
    Boolean: "boolean",
    Flow: "EXEC_FLOW",
} as const;

export type FlowIOTypes = (typeof FlowIOTypes)[keyof typeof FlowIOTypes];
