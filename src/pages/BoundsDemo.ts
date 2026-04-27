import { BasicMaterial, Camera2D, Canvas, Rect, Scene, getRectLocalBounds, getWorldBounds } from "raw2d";
import type { Object2DOriginKeyword, Rectangle } from "raw2d";
import type { BoundsDemoOptions, BoundsDemoState, BoundsDemoVariant } from "./BoundsDemo.type";

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

export function createBoundsDemo(options: BoundsDemoOptions = {}): HTMLElement {
  const variant = options.variant ?? "world";
  const state: BoundsDemoState = { origin: "center", rotation: getInitialRotation(variant), variant };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "shape-demo-canvas";
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  pre.append(code);

  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
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
  section.append(createTitle(variant), canvasElement, createControls(state, raw2dCanvas, scene, camera, rect, code), pre);
  updateDemo(raw2dCanvas, scene, camera, rect, state, code);
  return section;
}

function createTitle(variant: BoundsDemoVariant): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = getTitle(variant);
  body.textContent = getBody(variant);
  fragment.append(title, body);
  return fragment;
}

function createControls(
  state: BoundsDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  rect: Rect,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(createOriginSelect(state, raw2dCanvas, scene, camera, rect, code));
  controls.append(createRotationInput(state, raw2dCanvas, scene, camera, rect, code));
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
  raw2dCanvas: Canvas,
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
    updateDemo(raw2dCanvas, scene, camera, rect, state, code);
  });
  label.append(span, select);
  return label;
}

function createRotationInput(
  state: BoundsDemoState,
  raw2dCanvas: Canvas,
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
    updateDemo(raw2dCanvas, scene, camera, rect, state, code);
  });
  label.append(span, input);
  return label;
}

function updateDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, rect: Rect, state: BoundsDemoState, code: HTMLElement): void {
  rect.setOrigin(state.origin);
  rect.rotation = state.rotation;
  const localBounds = getRectLocalBounds(rect);
  const bounds = state.variant === "local" ? localBounds : getWorldBounds({ object: rect, localBounds });
  raw2dCanvas.render(scene, camera);
  drawBounds(raw2dCanvas.getContext(), bounds, state.variant);
  code.textContent = createCode(state, bounds);
}

function drawBounds(context: CanvasRenderingContext2D, bounds: Rectangle, variant: BoundsDemoVariant): void {
  context.save();
  context.strokeStyle = "#38bdf8";
  context.lineWidth = 2;
  context.setLineDash([7, 5]);
  if (variant === "local") {
    context.strokeRect(260 + bounds.x, 130 + bounds.y, bounds.width, bounds.height);
  } else {
    context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }
  context.restore();
}

function createCode(state: BoundsDemoState, bounds: Rectangle): string {
  if (state.variant === "rectangle") {
    return `const bounds = new Rectangle({
  x: ${bounds.x.toFixed(1)},
  y: ${bounds.y.toFixed(1)},
  width: ${bounds.width.toFixed(1)},
  height: ${bounds.height.toFixed(1)}
});

bounds.containsPoint({ x: 260, y: 130 });`;
  }

  if (state.variant === "local") {
    return `const localBounds = getRectLocalBounds(rect);

// x: ${bounds.x.toFixed(1)}, y: ${bounds.y.toFixed(1)}
// width: ${bounds.width.toFixed(1)}, height: ${bounds.height.toFixed(1)}`;
  }

  return `rect.setOrigin("${state.origin}");
rect.rotation = ${state.rotation.toFixed(2)};

const worldBounds = getWorldBounds({
  object: rect,
  localBounds: getRectLocalBounds(rect)
});

// x: ${bounds.x.toFixed(1)}, y: ${bounds.y.toFixed(1)}
// width: ${bounds.width.toFixed(1)}, height: ${bounds.height.toFixed(1)}`;
}

function getInitialRotation(variant: BoundsDemoVariant): number {
  return variant === "local" ? 0 : 0.72;
}

function getTitle(variant: BoundsDemoVariant): string {
  const titles: Record<BoundsDemoVariant, string> = {
    rectangle: "Live Rectangle Bounds",
    local: "Live Local Bounds",
    world: "Live World Bounds"
  };

  return titles[variant];
}

function getBody(variant: BoundsDemoVariant): string {
  const bodies: Record<BoundsDemoVariant, string> = {
    rectangle: "Rectangle stores x/y/width/height and can test points or intersections.",
    local: "Local bounds are the object size before world transform is applied.",
    world: "World bounds wrap the transformed object for selection or culling."
  };

  return bodies[variant];
}
