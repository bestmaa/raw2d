import type { DocTopic } from "./DocPage.type";

export const canvasInitTopics: readonly DocTopic[] = [
  {
    id: "canvas",
    label: "Canvas Init",
    title: "Canvas Init",
    description: "Create and control the public low-level Raw2D Canvas renderer.",
    sections: [
      {
        title: "Add A Canvas Element",
        body: "Canvas needs a real HTMLCanvasElement. Raw2D does not create hidden DOM for you.",
        code: `<canvas id="raw2d-canvas"></canvas>`
      },
      {
        title: "Create The Canvas Class",
        body: "Pass the DOM canvas element into the Raw2D Canvas wrapper.",
        code: `import { Canvas } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});`
      },
      {
        title: "Smallest Working Scene",
        body: "This is the minimum useful Canvas path: create renderer, scene, camera, object, then render once.",
        code: `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "What Render Does",
        body: "render(scene, camera) clears the canvas, traverses the scene, applies camera and object transforms, then draws supported objects.",
        code: `raw2dCanvas.render(scene, camera);`
      }
    ]
  }
];
