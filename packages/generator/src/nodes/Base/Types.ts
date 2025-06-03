export const FlowIOTypes = {
    String: "string",
    Number: "number",
    Flow: "flow",
    Object: "object",
    DiscordClient: "client",
    Array: "array",
    Any: "*",
    Boolean: "boolean"
} as const;

export type FlowIOTypes = (typeof FlowIOTypes)[keyof typeof FlowIOTypes];