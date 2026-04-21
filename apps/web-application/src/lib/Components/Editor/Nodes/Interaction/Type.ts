import { BaseGenerator, BaseNode, FlowIOTypes } from "@disflow-team/code-gen";
import { NodeCategoryColor } from "../Colors";

const controls = {
    "Slash": "ApplicationCommand",
    "Button": "MessageComponent",
    "Autocomplete": "ApplicationCommandAutocomplete",
    "Modal": "ModalSubmit"
}

export class InteractionType extends BaseNode {
    static noFlows: boolean = true;
    static title: string = "Interaction Type";
    static category: string = "Interaction";

    protected onBuild(): void {
        this.addProperty("type", "Slash", FlowIOTypes.String);
        this.setNodeColor(NodeCategoryColor.Interaction);

        this.addOutput("type", FlowIOTypes.Any);

        this.addWidget("combo", "Type", "Slash", (value) => {
            this.type = value
        }, {
            property: "type",
            values: Object.keys(controls)
        })
    }

    nodeToCode(): string {
        return "DisFlowDJS.InteractionType." + controls[this.properties.type as keyof typeof controls];
    }
}