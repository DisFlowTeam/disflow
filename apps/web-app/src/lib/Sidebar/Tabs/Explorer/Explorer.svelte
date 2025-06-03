<script lang='ts'>
    import { onMount } from "svelte";
    import BaseTab from "../BaseTab.svelte";
    import File from "./File.svelte";
    import { getGraph } from "@disflow-team/utils";
    import { generateCode } from "@disflow-team/code-gen";
    import { ClientNode } from "../../../Nodes";
    let commands = $state<{ name: string, content: string }[]>()
    let projectSettings = $state<{ name: string }>()

    onMount(() => {
        projectSettings = {
            name: "Hello World!"
        }

        const projectFiles = {
            main: "", // this will be the main file of the bot. the "index.js",
            commands: [ // replace with <Project>.commands later
                {
                    name: "ping",
                    content: ""
                }
            ]
        }

        commands = projectFiles.commands;
    })
</script>

<BaseTab>
    <div>
        <button onclick={() => {
            const graph = getGraph();

            const code = generateCode(graph, {
                onAfterContextCreate(ctx) {
                    /**
                     * Create an exception for the node ClientNode
                     * This will tell the program to assign `client` to whichever calls `.getVarNameByNode()` on `ClientNode`
                    */
                    ctx.registerException(ClientNode, "client");
                },
                filter(v) {
                    return !(v instanceof ClientNode);
                }
            });

            console.log(code);
        }}>Test Code Gen</button>
        <File name='index' fileType='df' />
        {#if commands}
            {#each commands as cmd}
                <File name={cmd.name} fileType="df" />
            {/each}
        {/if}
    </div>
</BaseTab>