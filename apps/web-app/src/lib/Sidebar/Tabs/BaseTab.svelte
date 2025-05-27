<script lang="ts">
    let { children } = $props()
</script>

<div class="sidebar-tab-container">
    {@render children?.()}
</div>

<style>
    .sidebar-tab-container {
        width: 85%;
        height: 100vh;
    }
</style>