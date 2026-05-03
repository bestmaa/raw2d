import type { DocTopic } from "./DocPage.type";

export const rendererChoiceTopics: readonly DocTopic[] = [
  {
    id: "renderer-choice",
    label: "Renderer Choice",
    title: "When To Use Canvas Or WebGL",
    description: "Choose Canvas for simple transparent rendering and WebGLRenderer2D for large batched scenes.",
    sections: [
      {
        title: "Use Canvas First",
        body: "Canvas is the recommended first renderer. It is easy to debug, works well for small tools, and keeps Raw2D internals readable while you build the scene.",
        code: `import { Canvas } from "raw2d";

const renderer = new Canvas({
  canvas,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});`
      },
      {
        title: "Move To WebGL For Scale",
        body: "Use WebGLRenderer2D when object count, sprite count, texture binds, or repeated redraws become the bottleneck. WebGL exposes batching stats so you can see what changed.",
        code: `import { WebGLRenderer2D } from "raw2d";

const renderer = new WebGLRenderer2D({
  canvas,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

renderer.render(scene, camera);
console.log(renderer.getStats().drawCalls);`
      },
      {
        title: "Keep The Same Scene",
        body: "Scene objects do not know whether Canvas or WebGL draws them. Swap the renderer, keep the scene and camera, then compare stats.",
        code: `const renderer = useWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });

renderer.render(scene, camera);
console.log(renderer.getStats());`
      },
      {
        title: "Benchmark Before Deciding",
        body: "Use /benchmark locally or https://raw2d.com/benchmark in production for practical comparison. Change object count, scene type, static ratio, atlas, and culling to see which renderer fits the current workload.",
        code: `// Local docs app:
// http://localhost:5175/benchmark

// Production docs:
// https://raw2d.com/benchmark`
      }
    ]
  }
];
