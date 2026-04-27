import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
import type { Object2DOriginKeyword } from "raw2d";
import type { OriginDemoState } from "./OriginDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;
const originOptions: readonly Object2DOriginKeyword[] = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right"
];

export function createOriginDemo(): HTMLElement {
  const state: OriginDemoState = { origin: "center", rotation: 0.5 };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "shape-demo-canvas";
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  pre.append(code);

  const rawCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const rect = new Rect({
    x: 260,
    y: 130,
    width: 170,
    height: 90,
    origin: state.origin,
    rotation: state.rotation,
    material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.72)" })
  });

  scene.add(rect);
  section.append(createTitle(), canvasElement, createControls(state, rawCanvas, scene, camera, rect, code), pre);
  updateDemo(rawCanvas, scene, camera, rect, state, code);
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Origin Example";
  body.textContent = "The red marker is object x/y. Changing origin changes where rotation attaches.";
  fragment.append(title, body);
  return fragment;
}

function createControls(
  state: OriginDemoState,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  rect: Rect,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(createOriginSelect(state, rawCanvas, scene, camera, rect, code));
  controls.append(createRotationInput(state, rawCanvas, scene, camera, rect, code));
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
}

function createOriginSelect(
  state: OriginDemoState,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  rect: Rect,
  code: HTMLElement
): HTMLElement {
  const label = document.createElement("label");
  label.className = "shape-demo-control";
  const span = document.createElement("span");
  const select = document.createElement("select");
  span.textContent = "Origin";

  for (const origin of originOptions) {
    const option = document.createElement("option");
    option.value = origin;
    option.textContent = origin;
    option.selected = origin === state.origin;
    select.append(option);
  }

  select.addEventListener("change", () => {
    state.origin = select.value as Object2DOriginKeyword;
    updateDemo(rawCanvas, scene, camera, rect, state, code);
  });
  label.append(span, select);
  return label;
}

function createRotationInput(
  state: OriginDemoState,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  rect: Rect,
  code: HTMLElement
): HTMLElement {
  const label = document.createElement("label");
  label.className = "shape-demo-control";
  const span = document.createElement("span");
  const input = document.createElement("input");
  span.textContent = `Rotation: ${state.rotation.toFixed(2)}`;
  input.type = "range";
  input.min = "0";
  input.max = "628";
  input.value = String(state.rotation * 100);
  input.addEventListener("input", () => {
    state.rotation = Number(input.value) / 100;
    span.textContent = `Rotation: ${state.rotation.toFixed(2)}`;
    updateDemo(rawCanvas, scene, camera, rect, state, code);
  });
  label.append(span, input);
  return label;
}

function updateDemo(rawCanvas: Canvas, scene: Scene, camera: Camera2D, rect: Rect, state: OriginDemoState, code: HTMLElement): void {
  rect.setOrigin(state.origin);
  rect.rotation = state.rotation;
  rawCanvas.render(scene, camera);
  drawAnchor(rawCanvas.getContext(), rect.x, rect.y);
  code.textContent = createCode(state);
}

function drawAnchor(context: CanvasRenderingContext2D, x: number, y: number): void {
  context.save();
  context.strokeStyle = "#ff4d6d";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x - 10, y);
  context.lineTo(x + 10, y);
  context.moveTo(x, y - 10);
  context.lineTo(x, y + 10);
  context.stroke();
  context.restore();
}

function createCode(state: OriginDemoState): string {
  return `const rect = new Rect({
  x: 260,
  y: 130,
  width: 170,
  height: 90,
  origin: "${state.origin}",
  rotation: ${state.rotation.toFixed(2)}
});

scene.add(rect);
rawCanvas.render(scene, camera);`;
}
