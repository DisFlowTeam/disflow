<script lang='ts'>
    import { onMount } from "svelte";

    let { children } = $props();

    onMount(() => {
        const beforeUnload = (ev: BeforeUnloadEvent) => {
            ev.preventDefault();
        }

        window.addEventListener("beforeunload", beforeUnload);

        return () => {
            window.removeEventListener("beforeunload", beforeUnload);
        }
    })
</script>

{@render children?.()}