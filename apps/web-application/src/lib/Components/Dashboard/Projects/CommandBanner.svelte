<script lang="ts">
	import { onMount } from "svelte";

    let {
        name,
        projectId,
        updatedAt
    }: {
        name: string,
        projectId: string,
        updatedAt: number
    } = $props()
</script>
<a href={`/dashboard/projects/${projectId}/editor/${name}`} class="w-72 h-32">
    <div class="w-full h-full rounded-lg items-center flex border-2 border-white/9 p-3 text-gray-300">
        <img src={"/DISFLOW_ICO.png"} alt={`${name}'s icon'`} class="h-10 mx-3 rounded-full">
        <div class="ml-3">
            <span class="text-2xl font-extrabold">{name}</span>
            <br>
            <span class="text-gray-400 text-sm">{new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(new Date(updatedAt))}</span>
        </div>
    </div>
</a>