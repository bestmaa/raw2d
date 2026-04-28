import type { DocSection } from "./DocPage.type";

export function createCameraControlsCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, CameraControls, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
const rect = new Rect({
  x: 120,
  y: 90,
  width: 180,
  height: 110,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
const controls = new CameraControls({
  target: canvasElement,
  camera,
  minZoom: 0.25,
  maxZoom: 4,
  onChange: () => raw2dCanvas.render(scene, camera)
});

controls.enableZoom();
controls.enablePan(0);

scene.add(rect);
raw2dCanvas.render(scene, camera);`, section);
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
