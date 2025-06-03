<script lang="ts">
    let {
        name,
        fileType
    }: { name: string, fileType: "df" | "json" } = $props()
</script>

<div class="file">{name}.{fileType}</div>

<style>
    .file {
        width: 100%;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-family: sans-serif;
        color: white;
    }
</style>