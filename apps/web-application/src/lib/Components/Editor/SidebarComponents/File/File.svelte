<script lang="ts">
    let { name }: { name: string } = $props();
</script>

<button class="w-full px-2 flex h-12 items-center transition-all duration-75 cursor-pointer hover:border-white hover:border-2" onclick={() => {

}}>
    <img src="/DISFLOW_ICO.png" alt="Disflow file" class="h-10 rounded-sm">
    <span class="ml-3 text-gray-200 text-lg">{name}</span>
</button>