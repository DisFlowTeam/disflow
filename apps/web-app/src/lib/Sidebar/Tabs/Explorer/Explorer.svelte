<script lang='ts'>
    import { onMount } from "svelte";
    import BaseTab from "../BaseTab.svelte";
    import File from "./File.svelte";
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
        <File name='index' fileType='df' />
        {#if commands}
            {#each commands as cmd}
                <File name={cmd.name} fileType="df" />
            {/each}
        {/if}
    </div>
</BaseTab>