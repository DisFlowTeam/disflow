<script lang="ts">
	import { page } from "$app/state";
	import { logged } from "$lib";
	import Editor from "$lib/Components/Editor/Editor.svelte";
</script>

{#if logged.isLogged}
    <Editor project={page.params.id!} />
{/if}