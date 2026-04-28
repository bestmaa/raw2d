import type { DocSection } from "./DocPage.type";

export function createRenderOrderCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const back = new Rect({
  x: 90,
  y: 80,
  width: 160,
  height: 110,
  zIndex: 0,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
const front = new Rect({
  x: 170,
  y: 110,
  width: 160,
  height: 110,
  zIndex: 10,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(front);
scene.add(back);
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
