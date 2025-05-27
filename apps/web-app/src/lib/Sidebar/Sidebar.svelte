<script lang="ts">
    import Explorer from "./Tabs/Explorer/Explorer.svelte";

    let currentTab = $state<"explorer">("explorer")
</script>

<div class="sidebar">
    <div class="sidebar-small"></div>
    {#if currentTab === "explorer"}
        <Explorer />
    {/if}
</div>

<style>
    .sidebar {
        height: 100vh;
        width: 25vw;
        display: flex;
        border-right: solid gray 1px;
        background: #282828;
    }

    .sidebar-small {
        height: 100vh;
        width: 15%;
        border-right: solid gray 1px;
        background: #252525;
    }
</style>