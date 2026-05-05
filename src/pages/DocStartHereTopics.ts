import type { DocTopic } from "./DocPage.type";

export const startHereTopics: readonly DocTopic[] = [
  {
    id: "start-here-guide",
    label: "Start Here",
    title: "Start Here",
    description: "The shortest beginner path from install to first render, examples, Studio, WebGL, React, and MCP.",
    sections: [
      {
        title: "What To Install First",
        body: "Use the umbrella package first. It keeps imports simple while you learn the public API.",
        code: `npm install raw2d`
      },
      {
        title: "First Render Goal",
        body: "Start with Canvas, one Scene, one Camera2D, one Rect, and one render call. This proves the app owns timing and Raw2D only draws.",
        code: `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);`
      },
      {
        title: "Beginner Order",
        body: "Read in this order: install, Canvas, Scene, Camera2D, Rect or Circle, Texture, Sprite, examples, Studio, WebGL, Interaction, then React or MCP only if needed.",
        code: `Start Here -> Canvas Init -> Scene -> Camera2D -> Rect
Texture -> Sprite -> Examples -> Studio -> Canvas / WebGL -> Interaction Path
React Later -> MCP`
      },
      {
        title: "When To Use Canvas",
        body: "Use Canvas when correctness, debugging, simple scenes, or complete feature coverage matters more than batch throughput.",
        code: `import { Canvas } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });`
      },
      {
        title: "When To Use WebGL",
        body: "Use WebGL when the scene has many sprites, repeated shapes, texture atlas usage, and draw-call pressure.",
        code: `import { WebGLRenderer2D, isWebGL2Available } from "raw2d";

const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 600 })
  : new Canvas({ canvas: canvasElement, width: 800, height: 600 });`
      },
      {
        title: "What To Open Next",
        body: "After this page, open Beginner Path for the step-by-step flow, Examples for copy-paste runnable scenes, then Studio to inspect how Raw2D scene data becomes an editor workflow.",
        code: `/doc#beginner-path
/doc#examples
/examples/canvas-basic/
/examples/webgl-basic/
/doc#studio-shell
/studio`
      }
    ]
  }
];
