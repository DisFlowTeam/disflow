<script lang="ts">
  import { createEditor } from "@disflow-team/utils";
  import { onMount } from "svelte";
  import "litegraph.js/css/litegraph.css"
  let canvas: HTMLCanvasElement
  onMount(() => {
    createEditor(canvas)
  })
</script>

<main>
  <canvas width="1024" height="720" bind:this={canvas}></canvas>
</main>
