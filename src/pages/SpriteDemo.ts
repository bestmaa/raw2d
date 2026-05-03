import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";
import type { SpriteDemoState } from "./SpriteDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;
const demoTextureUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='18' fill='%2335c2ff'/%3E%3Ccircle cx='42' cy='45' r='14' fill='%23f5f7fb'/%3E%3Ccircle cx='86' cy='45' r='14' fill='%23f5f7fb'/%3E%3Cpath d='M38 82c14 16 38 16 52 0' fill='none' stroke='%2310141c' stroke-width='10' stroke-linecap='round'/%3E%3C/svg%3E";
const originOptions = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right"
] as const;

export function createSpriteDemo(): HTMLElement {
  const state: SpriteDemoState = {
    x: 260,
    y: 130,
    size: 128,
    opacity: 1,
    rotation: 0,
    origin: "center"
  };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";

  const canvasElement = document.createElement("canvas");
  canvasElement.className = "shape-demo-canvas";
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  pre.append(code);

  const raw2dCanvas = new Canvas({
    canvas: canvasElement,
    width: demoCanvasWidth,
    height: demoCanvasHeight,
    backgroundColor: "#10141c"
  });
  const scene = new Scene();
  const camera = new Camera2D();

  section.append(createTitle(), canvasElement, createLoadingText(), pre);
  void setupSpriteDemo(section, raw2dCanvas, scene, camera, state, code);
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Sprite Example";
  body.textContent = "TextureLoader loads an image, then Sprite renders it on the canvas.";
  fragment.append(title, body);
  return fragment;
}

function createLoadingText(): HTMLElement {
  const loading = document.createElement("p");
  loading.className = "shape-demo-loading";
  loading.textContent = "Loading texture...";
  return loading;
}

async function setupSpriteDemo(
  section: HTMLElement,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  state: SpriteDemoState,
  code: HTMLElement
): Promise<void> {
  const texture = await new TextureLoader().load(demoTextureUrl);
  const sprite = new Sprite({
    x: state.x,
    y: state.y,
    texture,
    origin: state.origin,
    width: state.size,
    height: state.size
  });

  scene.add(sprite);
  section.querySelector(".shape-demo-loading")?.remove();
  const controls = createControls(state, raw2dCanvas, scene, camera, sprite, code);
  const codeBlock = code.parentElement;

  if (codeBlock?.parentElement === section) {
    section.insertBefore(controls, codeBlock);
  } else {
    section.append(controls);
  }

  updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
}

function createControls(
  state: SpriteDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  sprite: Sprite,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(createRangeInput("X", 0, 420, state.x, (value) => {
    state.x = value;
    updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
  }));
  controls.append(createRangeInput("Y", 0, 180, state.y, (value) => {
    state.y = value;
    updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
  }));
  controls.append(createRangeInput("Size", 48, 180, state.size, (value) => {
    state.size = value;
    updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
  }));
  controls.append(createRangeInput("Opacity", 10, 100, state.opacity * 100, (value) => {
    state.opacity = value / 100;
    updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
  }));
  controls.append(createRangeInput("Rotation", 0, 628, state.rotation * 100, (value) => {
    state.rotation = value / 100;
    updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
  }));
  controls.append(createOriginSelect(state, raw2dCanvas, scene, camera, sprite, code));
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
}

function createRangeInput(
  labelText: string,
  min: number,
  max: number,
  value: number,
  onInput: (value: number) => void
): HTMLElement {
  const label = document.createElement("label");
  label.className = "shape-demo-control";
  const span = document.createElement("span");
  const input = document.createElement("input");
  span.textContent = `${labelText}: ${formatValue(labelText, value)}`;
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);
  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    span.textContent = `${labelText}: ${formatValue(labelText, nextValue)}`;
    onInput(nextValue);
  });
  label.append(span, input);
  return label;
}

function createOriginSelect(
  state: SpriteDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  sprite: Sprite,
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
    state.origin = select.value as SpriteDemoState["origin"];
    updateDemo(raw2dCanvas, scene, camera, sprite, state, code);
  });
  label.append(span, select);
  return label;
}

function updateDemo(
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  sprite: Sprite,
  state: SpriteDemoState,
  codeElement: HTMLElement
): void {
  sprite.setPosition(state.x, state.y);
  sprite.setSize(state.size, state.size);
  sprite.setOpacity(state.opacity);
  sprite.setOrigin(state.origin);
  sprite.rotation = state.rotation;
  raw2dCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: SpriteDemoState): string {
  return `import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const texture = await new TextureLoader().load("/sprite.png");
const scene = new Scene();
const camera = new Camera2D();

const sprite = new Sprite({
  x: ${state.x},
  y: ${state.y},
  texture,
  origin: "${state.origin}",
  width: ${state.size},
  height: ${state.size},
  opacity: ${state.opacity.toFixed(2)},
  rotation: ${state.rotation.toFixed(2)}
});

scene.add(sprite);
raw2dCanvas.render(scene, camera);`;
}

function formatValue(label: string, value: number): string {
  if (label === "Opacity") {
    return (value / 100).toFixed(2);
  }

  if (label === "Rotation") {
    return (value / 100).toFixed(2);
  }

  return String(value);
}
