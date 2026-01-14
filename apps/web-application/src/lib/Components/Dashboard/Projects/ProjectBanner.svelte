<script lang="ts">
    let {
        id,
        icon,
        name,
        version
    }: {
        icon: string,
        name: string,
        id: string
        version?: string
    } = $props()
</script>
<a href={`/dashboard/projects/${id}`} class="w-72 h-32">
    <div class="w-full h-full rounded-lg items-center flex border-2 border-white/9 p-3 text-gray-300">
        <img src={icon} alt={`${name}'s icon'`} class="h-10 mx-3 rounded-full">
        <div class="ml-3">
            <span class="text-2xl font-extrabold">{name}</span>
            <br>
            <span class="text-gray-400 text-sm">v{version || "0.0.1"}</span>
        </div>
    </div>
</a>