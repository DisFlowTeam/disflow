import { BaseNode, FlowIOTypes, FlowMode } from "@disflow-team/code-gen";

/**
 * Special Node that requires no code generation.
 * Check the usage of generateCode in this app to see how it is used.
 */
export class ClientNode extends BaseNode {
    static title: string = "client";
    static category: string = "Discord";

    protected builder(): void {
        this.setName("Client");
        this.addOutput("value", FlowIOTypes.DiscordClient);
        this.includeFlow = FlowMode.Off;
    }

    onGenerateCode(): string {
        return ""
    }
}