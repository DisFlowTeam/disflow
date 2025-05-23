import { LGraph, LGraphCanvas } from "litegraph.js";

export type LGraphCanvasOptions = ConstructorParameters<typeof LGraphCanvas>[2];

let graph: LGraph | undefined = undefined;
let canvas: LGraphCanvas | undefined = undefined;

export function getGraph(o?: object) {
    if(!graph) graph = new LGraph(o);
    return graph;
}

export function constructCanvas(...args: ConstructorParameters<typeof LGraphCanvas>) {
    canvas = new LGraphCanvas(...args);
    return canvas;
}

export function getCanvas() {
    if(!canvas) throw new Error("Canvas not yet initialized. Call `constructCanvas` first");
    return canvas;
}

export function createEditor(
    element: HTMLCanvasElement,
    graphOptions?: object,
    canvasOptions: LGraphCanvasOptions = { autoresize: true }
) {
    const graph = getGraph(graphOptions);
    const canvas = constructCanvas(element, graph, canvasOptions);

    return { graph, canvas };
}