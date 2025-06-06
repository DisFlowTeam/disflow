<script lang="ts">
	import Navbar from "$lib/Components/Navbar.svelte";
    import "../app.css"
    let { children } = $props()
</script>

<div>
    <Navbar />
    <div class="mt-20">
        {@render children()}
    </div>
</div>