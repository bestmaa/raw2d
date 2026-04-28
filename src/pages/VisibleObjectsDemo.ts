import { BasicMaterial, Camera2D, Canvas, Rect, Scene, getVisibleObjects } from "raw2d";
import type { CoreBoundsObject } from "raw2d";
import type { VisibleObjectsDemoRenderOptions, VisibleObjectsDemoState } from "./VisibleObjectsDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createVisibleObjectsDemo(): HTMLElement {
  const state: VisibleObjectsDemoState = { x: 0, zoom: 1 };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D(state);
  const objects = createObjects(scene);

  title.textContent = "Live Visible Objects";
  body.textContent = "Move the camera. Objects outside the camera world bounds are dimmed.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(title, body, canvasElement, createControls(state, raw2dCanvas, scene, camera, objects, code), pre);
  renderDemo({ raw2dCanvas, scene, camera, state, objects, code });
  return section;
}

function createObjects(scene: Scene): readonly Rect[] {
  const objects = [
    new Rect({ name: "A", x: 30, y: 70, width: 90, height: 80 }),
    new Rect({ name: "B", x: 190, y: 70, width: 90, height: 80 }),
    new Rect({ name: "C", x: 350, y: 70, width: 90, height: 80 }),
    new Rect({ name: "D", x: 510, y: 70, width: 90, height: 80 }),
    new Rect({ name: "E", x: 670, y: 70, width: 90, height: 80 })
  ];

  for (const object of objects) {
    scene.add(object);
  }

  return objects;
}

function createControls(
  state: VisibleObjectsDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  objects: readonly Rect[],
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Camera X", 0, 420, state.x, (value) => updateCamera("x", value, state, raw2dCanvas, scene, camera, objects, code)),
    createRangeControl("Zoom", 0.8, 2.4, state.zoom, (value) => updateCamera("zoom", value, state, raw2dCanvas, scene, camera, objects, code), 0.1)
  );
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Camera";
  return title;
}

function createRangeControl(label: string, min: number, max: number, value: number, onInput: (value: number) => void, step = 1): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "shape-demo-control";
  const text = document.createElement("span");
  const input = document.createElement("input");
  text.textContent = `${label}: ${value}`;
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    text.textContent = `${label}: ${nextValue}`;
    onInput(nextValue);
  });
  wrapper.append(text, input);
  return wrapper;
}

function updateCamera(
  key: keyof VisibleObjectsDemoState,
  value: number,
  state: VisibleObjectsDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  objects: readonly Rect[],
  code: HTMLElement
): void {
  state[key] = value;
  camera.setPosition(state.x, 0);
  camera.setZoom(state.zoom);
  renderDemo({ raw2dCanvas, scene, camera, state, objects, code });
}

function renderDemo(options: VisibleObjectsDemoRenderOptions): void {
  const visibleObjects = getVisibleObjects({ scene: options.scene, camera: options.camera, width: demoCanvasWidth, height: demoCanvasHeight });
  updateMaterials(options.objects, visibleObjects);
  options.raw2dCanvas.render(options.scene, options.camera);
  drawOverlay(options.raw2dCanvas.getContext(), visibleObjects);
  options.code.textContent = createCode(visibleObjects);
}

function updateMaterials(objects: readonly Rect[], visibleObjects: readonly CoreBoundsObject[]): void {
  for (const object of objects) {
    const color = visibleObjects.includes(object) ? "rgba(53, 194, 255, 0.82)" : "rgba(100, 116, 139, 0.36)";
    object.material = new BasicMaterial({ fillColor: color });
  }
}

function drawOverlay(context: CanvasRenderingContext2D, visibleObjects: readonly CoreBoundsObject[]): void {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`visible: ${visibleObjects.map((object) => object.name).join(", ")}`, 16, 24);
  context.restore();
}

function createCode(visibleObjects: readonly CoreBoundsObject[]): string {
  return `const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: ${demoCanvasWidth},
  height: ${demoCanvasHeight}
});

// visible: ${visibleObjects.map((object) => object.name).join(", ")}`;
}
