import { BasicMaterial, Camera2D, Canvas, Line, Rect, Scene, getCameraWorldBounds } from "raw2d";
import type { CameraBoundsDemoRenderOptions, CameraBoundsDemoState } from "./CameraBoundsDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createCameraBoundsDemo(): HTMLElement {
  const state: CameraBoundsDemoState = { x: 80, y: 40, zoom: 1.5 };
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

  title.textContent = "Live Camera Bounds";
  body.textContent = "Change camera values. The visible world rectangle updates from the viewport size and zoom.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  addGrid(scene);
  addObjects(scene);
  section.append(title, body, canvasElement, createControls(state, raw2dCanvas, scene, camera, code), pre);
  renderDemo(raw2dCanvas, scene, camera, state, code);
  return section;
}

function addGrid(scene: Scene): void {
  for (let value = -100; value <= 700; value += 50) {
    const color = value === 0 ? "#64748b" : "rgba(148, 163, 184, 0.24)";
    scene.add(new Line({ x: value, y: -100, endX: 0, endY: 520, material: new BasicMaterial({ strokeColor: color, lineWidth: 1 }) }));
    scene.add(new Line({ x: -100, y: value, endX: 820, endY: 0, material: new BasicMaterial({ strokeColor: color, lineWidth: 1 }) }));
  }
}

function addObjects(scene: Scene): void {
  scene.add(new Rect({ x: 80, y: 60, width: 140, height: 80, material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.72)" }) }));
  scene.add(new Rect({ x: 330, y: 160, width: 170, height: 90, material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.68)" }) }));
}

function createControls(
  state: CameraBoundsDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Camera X", -100, 320, state.x, (value) => updateCamera("x", value, state, raw2dCanvas, scene, camera, code)),
    createRangeControl("Camera Y", -80, 220, state.y, (value) => updateCamera("y", value, state, raw2dCanvas, scene, camera, code)),
    createRangeControl("Zoom", 0.5, 3, state.zoom, (value) => updateCamera("zoom", value, state, raw2dCanvas, scene, camera, code), 0.1)
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
  key: keyof CameraBoundsDemoState,
  value: number,
  state: CameraBoundsDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  code: HTMLElement
): void {
  state[key] = value;
  camera.setPosition(state.x, state.y);
  camera.setZoom(state.zoom);
  renderDemo(raw2dCanvas, scene, camera, state, code);
}

function renderDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, state: CameraBoundsDemoState, code: HTMLElement): void {
  const bounds = getCameraWorldBounds({ camera, width: demoCanvasWidth, height: demoCanvasHeight });
  raw2dCanvas.render(scene, camera);
  drawOverlay(raw2dCanvas.getContext(), { raw2dCanvas, scene, camera, bounds, state, code });
  code.textContent = createCode(bounds);
}

function drawOverlay(context: CanvasRenderingContext2D, options: CameraBoundsDemoRenderOptions): void {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`bounds x: ${round(options.bounds.x)} y: ${round(options.bounds.y)}`, 16, 24);
  context.fillText(`w: ${round(options.bounds.width)} h: ${round(options.bounds.height)}`, 16, 44);
  context.restore();
}

function createCode(bounds: CameraBoundsDemoRenderOptions["bounds"]): string {
  return `const bounds = getCameraWorldBounds({
  camera,
  width: ${demoCanvasWidth},
  height: ${demoCanvasHeight}
});

// x ${round(bounds.x)}, y ${round(bounds.y)}
// width ${round(bounds.width)}, height ${round(bounds.height)}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
