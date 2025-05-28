<script lang='ts'>
    import { onMount } from "svelte";
    import BaseTab from "../BaseTab.svelte";
    import File from "./File.svelte";
    import { getGraph } from "@disflow-team/utils";
  import { generateCode } from "@disflow-team/code-gen";
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

            const code = generateCode(graph);

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