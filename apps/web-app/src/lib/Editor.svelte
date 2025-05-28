<script lang="ts">
    import { createEditor } from "@disflow-team/utils";
    import { onMount } from "svelte";
    import Sidebar from "./Sidebar/Sidebar.svelte";
    import "litegraph.js/css/litegraph.css";
    import { LiteGraph } from "litegraph.js"
    import * as NodesObj from "../lib/Nodes";

    const Nodes = Object.values(NodesObj);

    LiteGraph.clearRegisteredTypes();
    for(const Node of Nodes) {
        LiteGraph.registerNodeType(Node.buildName(), Node);
    }

    let canvas: HTMLCanvasElement;

    onMount(() => {
        canvas.width = (window.innerWidth / 100) * 75;
        canvas.height = (window.innerHeight / 100) * 95;
        createEditor(canvas, undefined, {
            autoresize: false
        })
    })
</script>

<div class="main-editor-container">
    <Sidebar />
    <div style="overflow: hidden">
        <div class="top-tabs"></div>
        <canvas class="canvas" bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .main-editor-container {
        height: 100vh;
        width: 100vw;
        display: flex;
    }

    .top-tabs {
        height: 5vh;
        width: 75vw;
        background: #282828;
        border-bottom: solid gray 1px;
    }

    .canvas {
        width: 75vw;
        height: 95vh;
    }
</style>