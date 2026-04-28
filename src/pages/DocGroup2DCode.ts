import type { DocSection } from "./DocPage.type";

export function createGroup2DCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Circle, Group2D, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const group = new Group2D({ x: 220, y: 140, rotation: 0.2 });
const rect = new Rect({
  x: -80,
  y: -40,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
const circle = new Circle({
  x: 70,
  y: 0,
  radius: 42,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

group.add(rect);
group.add(circle);
scene.add(group);
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
