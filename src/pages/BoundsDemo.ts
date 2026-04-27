import { BasicMaterial, Camera2D, Canvas, Rect, Scene, getRectLocalBounds, getWorldBounds } from "raw2d";
import type { Object2DOriginKeyword, Rectangle } from "raw2d";
import type { BoundsDemoState } from "./BoundsDemo.type";

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

export function createBoundsDemo(): HTMLElement {
  const state: BoundsDemoState = { origin: "center", rotation: 0.72 };
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
    material: new BasicMaterial({ fillColor: "rgba(250, 204, 21, 0.64)" })
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
  title.textContent = "Live Bounds Example";
  body.textContent = "The yellow shape is the object. The blue outline is its world bounds.";
  fragment.append(title, body);
  return fragment;
}

function createControls(
  state: BoundsDemoState,
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
  state: BoundsDemoState,
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
  state: BoundsDemoState,
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

function updateDemo(rawCanvas: Canvas, scene: Scene, camera: Camera2D, rect: Rect, state: BoundsDemoState, code: HTMLElement): void {
  rect.setOrigin(state.origin);
  rect.rotation = state.rotation;
  const bounds = getWorldBounds({ object: rect, localBounds: getRectLocalBounds(rect) });
  rawCanvas.render(scene, camera);
  drawBounds(rawCanvas.getContext(), bounds);
  code.textContent = createCode(state, bounds);
}

function drawBounds(context: CanvasRenderingContext2D, bounds: Rectangle): void {
  context.save();
  context.strokeStyle = "#38bdf8";
  context.lineWidth = 2;
  context.setLineDash([7, 5]);
  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.restore();
}

function createCode(state: BoundsDemoState, bounds: Rectangle): string {
  return `rect.setOrigin("${state.origin}");
rect.rotation = ${state.rotation.toFixed(2)};

const worldBounds = getWorldBounds({
  object: rect,
  localBounds: getRectLocalBounds(rect)
});

// x: ${bounds.x.toFixed(1)}, y: ${bounds.y.toFixed(1)}
// width: ${bounds.width.toFixed(1)}, height: ${bounds.height.toFixed(1)}`;
}
