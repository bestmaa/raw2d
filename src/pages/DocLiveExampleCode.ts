import {
  fullArcExample,
  fullCircleExample,
  fullEllipseExample,
  fullLineExample,
  fullPolygonExample,
  fullPolylineExample,
  fullRectExample,
  fullSpriteExample,
  fullText2DExample,
  fullTextureExample
} from "./DocFullExamples";
import { createCameraControlsCode } from "./DocCameraControlsCode";
import { createCameraBoundsCode } from "./DocCameraBoundsCode";
import { fullShapePathExample } from "./DocPathExamples";
import { getInteractionLiveCode } from "./DocInteractionLiveCode";
import { createRenderOrderCode } from "./DocRenderOrderCode";
import { createVisibleObjectsCode } from "./DocVisibleObjectsCode";
import type { DocSection } from "./DocPage.type";

const fullExamples: Readonly<Record<string, string>> = {
  rect: fullRectExample,
  circle: fullCircleExample,
  ellipse: fullEllipseExample,
  arc: fullArcExample,
  line: fullLineExample,
  polyline: fullPolylineExample,
  polygon: fullPolygonExample,
  "shape-path": fullShapePathExample,
  text2d: fullText2DExample,
  sprite: fullSpriteExample,
  "bounds-sprite": fullSpriteExample,
  "bounds-text2d": fullText2DExample
};

export function getLiveExampleCode(section: DocSection): string {
  if (section.liveCode) {
    return section.liveCode;
  }

  if (section.liveDemoId === "interaction-controller") {
    return getInteractionLiveCode(section);
  }

  if (section.liveDemoId === "camera-bounds") {
    return createCameraBoundsCode(section);
  }

  if (section.liveDemoId === "visible-objects") {
    return createVisibleObjectsCode(section);
  }

  if (section.liveDemoId === "render-order") {
    return createRenderOrderCode(section);
  }

  if (section.liveDemoId === "camera-controls") {
    return createCameraControlsCode(section);
  }

  if (section.liveDemoId === "keyboard") {
    return createKeyboardCode(section);
  }

  if (section.title.includes("Texture")) {
    return withFocusComment(fullTextureExample, section);
  }

  if (section.liveDemoId === "hit-testing") {
    return createHitTestingCode(section);
  }

  if (section.liveDemoId?.startsWith("bounds")) {
    return createBoundsCode(section);
  }

  if (section.liveDemoId?.startsWith("origin")) {
    return createOriginCode(section);
  }

  if (section.liveDemoId === "selection" || section.liveDemoId === "dragging" || section.liveDemoId === "resize") {
    return createInteractionHelperCode(section);
  }

  const fullExample = section.liveDemoId ? fullExamples[section.liveDemoId] : null;
  return fullExample ? withFocusComment(fullExample, section) : section.code ?? "";
}

function withFocusComment(example: string, section: DocSection): string {
  return `${example}

// Focus: ${section.title}
${commentBlock(section.code ?? section.body)}`;
}

function createHitTestingCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Circle, Rect, Scene, pickObject } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({ x: 120, y: 90, width: 160, height: 90, material: new BasicMaterial({ fillColor: "#f45b69" }) });
const circle = new Circle({ x: 340, y: 130, radius: 54, material: new BasicMaterial({ fillColor: "#35c2ff" }) });

scene.add(rect);
scene.add(circle);
raw2dCanvas.render(scene, camera);

canvasElement.addEventListener("pointerdown", (event) => {
  const bounds = canvasElement.getBoundingClientRect();
  const pointerX = event.clientX - bounds.left;
  const pointerY = event.clientY - bounds.top;
  const picked = pickObject({ scene, x: pointerX, y: pointerY, tolerance: 8 });
  console.log(picked?.name ?? picked?.id ?? "none");
});`, section);
}

function createBoundsCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Rect, Scene, getRectLocalBounds, getWorldBounds } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  x: 260,
  y: 130,
  width: 170,
  height: 90,
  origin: "center",
  rotation: 0.72,
  material: new BasicMaterial({ fillColor: "rgba(250, 204, 21, 0.64)" })
});

scene.add(rect);

const localBounds = getRectLocalBounds(rect);
const worldBounds = getWorldBounds({ object: rect, localBounds });

console.log({ localBounds, worldBounds });
raw2dCanvas.render(scene, camera);`, section);
}

function createOriginCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  x: 260,
  y: 130,
  width: 170,
  height: 90,
  origin: "center",
  rotation: 0.5,
  material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.72)" })
});

scene.add(rect);
raw2dCanvas.render(scene, camera);`, section);
}

function createInteractionHelperCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, Rect, Scene, SelectionManager } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({ name: "card", x: 120, y: 80, width: 180, height: 104, material: new BasicMaterial({ fillColor: "#f45b69" }) });
const selection = new SelectionManager();

scene.add(rect);
selection.select(rect);
raw2dCanvas.render(scene, camera);`, section);
}

function createKeyboardCode(section: DocSection): string {
  return withFocusComment(`import { BasicMaterial, Camera2D, Canvas, KeyboardController, Rect, Scene, SelectionManager } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  name: "card",
  x: 178,
  y: 86,
  width: 164,
  height: 96,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});
const selection = new SelectionManager({ objects: [rect] });
const keyboard = new KeyboardController({
  target: window,
  selection,
  scene,
  moveStep: 4,
  fastMoveStep: 20,
  onChange: () => raw2dCanvas.render(scene, camera)
});

keyboard.enableMove();
keyboard.enableDelete();
keyboard.enableClear();

scene.add(rect);
raw2dCanvas.render(scene, camera);`, section);
}

function commentBlock(value: string): string {
  return value
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
}
