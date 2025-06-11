<script lang="ts">
	import { onMount } from "svelte";
	import File from "./File.svelte";

    let commands: { name: string, file: string }[] = $state([]);
    let projectName: string = $state("");
    
    onMount(() => {
        // if(location.pathname === "/demo") {
        const demoDataRaw = localStorage.getItem("demo_project");
        const demoData = JSON.parse(demoDataRaw!);
            
        commands = demoData.commands;
        projectName = demoData.name;
        // }
    })
</script>

<div class="pl-2 text-white pt-2">
    Project: {projectName}
</div>
<File name="main" />
{#each commands as command}
    <File name={command.name} />
{/each}