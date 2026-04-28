import type { DocSection } from "./DocPage.type";

export function createVisibleObjectsCode(section: DocSection): string {
  if (section.title.includes("Culling") || section.title.includes("Drawing") || section.title.includes("Render")) {
    return createCanvasCullingCode(section);
  }

  return withFocusComment(`import { Camera2D, getVisibleObjects } from "raw2d";

const camera = new Camera2D({
  x: 0,
  y: 0,
  zoom: 1
});

const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600
});

for (const object of visibleObjects) {
  console.log(object.name || object.id);
}`, section);
}

function createCanvasCullingCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  name: "card",
  x: 120,
  y: 80,
  width: 180,
  height: 104,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
raw2dCanvas.render(scene, camera, { culling: true });`, section);
}

function withFocusComment(example: string, section: DocSection): string {
  return `${example}

// Focus: ${section.title}
${commentBlock(section.code ?? section.body)}`;
}

function commentBlock(value: string): string {
  return value
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
}
