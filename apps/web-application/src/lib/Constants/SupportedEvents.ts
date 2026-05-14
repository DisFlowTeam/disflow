import type { BaseNode } from "@disflow-team/code-gen";
import { DEFAULT_NODES, toObjectValues } from "./DefaultNodes";
import * as InteractionNodes from "../Components/Editor/Nodes/Interaction";

export interface SupportedEvent {
    name: string;
    nodes: (typeof BaseNode)[];
    generatorTemplate: string;
    intentsRequired?: string[];
    warn?: string;
}

export const SUPPORTED_EVENTS: SupportedEvent[] = [
    {
        name: "Ready",
        nodes: [...DEFAULT_NODES],
        generatorTemplate: `disflowClient.on(DisflowDJS.Events.Ready, async () => {
            {{DISFLOW_GENERATED_CODE}}
        })`
    },
    {
        name: "Message",
        // TODO: Add message nodes once they are implemented
        nodes: [...DEFAULT_NODES],
        generatorTemplate: `disflowClient.on(DisflowDJS.Events.MessageCreate, async (message) => {
            {{DISFLOW_GENERATED_CODE}}
        })`,
        intentsRequired: ["GuildMessages", "MessageContent"],
        warn: "This event requires the \"Message Content\" intent to be toggled in the Discord Developer Portal."
    }
]