<script lang="ts">
	import type { Component } from "svelte";

    let {
        Icon,
        link,
        text
    }: {
        Icon: Component,
        link: string,
        text: string
    } = $props()
</script>
<a href={link}>
    <div class="hover:bg-slate-900 rounded-lg transition-all flex items-center pl-2 w-11/12 h-10 mx-auto">
        <Icon color="#71717b" />
        <span class="text-gray-300 ml-3">{text}</span>
    </div>
</a>