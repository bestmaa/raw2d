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
        body: "Use Renderer2DLike when a tool should accept Canvas or WebGLRenderer2D.",
        code: `import type { Renderer2DLike } from "raw2d-core";

function drawFrame(renderer: Renderer2DLike, scene: Scene, camera: Camera2D): void {
  renderer.render(scene, camera);
}`
      },
      {
        title: "Choose Canvas Or WebGL",
        body: "Both public renderers implement the shared lifecycle. Renderer-specific APIs stay available on their concrete classes.",
        code: `const renderer: Renderer2DLike = useWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });

renderer.setSize(800, 600);
renderer.render(scene, camera);
console.log(renderer.getStats());`
      },
      {
        title: "Lifecycle",
        body: "The contract includes explicit cleanup, which is important for future integrations and renderer swapping.",
        code: `renderer.setBackgroundColor("#10141c");
renderer.render(scene, camera);
renderer.dispose();`
      }
    ]
  }
];
