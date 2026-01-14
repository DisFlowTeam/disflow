<script lang="ts">
	import { identify } from "$lib/Gun/Utils";
	import { onMount } from "svelte";

    onMount(async () => {
        const userData = await identify();

        if(userData) window.location.replace("/dashboard/projects")
    })
</script>