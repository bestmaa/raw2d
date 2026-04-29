import type { DocTopic } from "./DocPage.type";

export const rendererTopics: readonly DocTopic[] = [
  {
    id: "renderer2d",
    label: "Renderer2D",
    title: "Renderer2D Contract",
    description: "Renderer2DLike is the shared low-level contract for Canvas and WebGLRenderer2D.",
    sections: [
      {
        title: "Generic Renderer",
        body: "Use Renderer2DLike when a tool should accept Canvas or WebGLRenderer2D without knowing the concrete renderer.",
        code: `import type { Renderer2DLike } from "raw2d-core";

function drawFrame(renderer: Renderer2DLike, scene: Scene, camera: Camera2D): void {
  renderer.render(scene, camera, { culling: true });
}`
      },
      {
        title: "Choose Canvas Or WebGL",
        body: "Both public renderers implement the same lifecycle. Renderer-specific APIs stay available on their concrete classes.",
        code: `const renderer: Renderer2DLike = useWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });

renderer.setSize(800, 600);
renderer.render(scene, camera);
console.log(renderer.getStats());`
      },
      {
        title: "Shared Stats",
        body: "Generic tools can read object count, draw calls, and render-list stats from either renderer.",
        code: `const stats = renderer.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.renderList.total);
console.log(stats.renderList.culled);`
      },
      {
        title: "Lifecycle",
        body: "The contract includes explicit clear, resize, background, and cleanup methods for future integrations and renderer swapping.",
        code: `renderer.setBackgroundColor("#10141c");
renderer.clear();
renderer.render(scene, camera);
renderer.dispose();`
      }
    ]
  }
];
