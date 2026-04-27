import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
import type { RectDemoState } from "./RectDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createRectDemo(): HTMLElement {
  const state: RectDemoState = {
    x: 170,
    y: 80,
    width: 180,
    height: 100,
    fillColor: "#f45b69"
  };

  const section = document.createElement("article");
  section.className = "doc-section shape-demo";

  const title = document.createElement("h2");
  title.textContent = "Live Rect Controls";

  const body = document.createElement("p");
  body.textContent = "Change width and height. The Rect data updates, then the canvas redraws.";

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

  const rect = new Rect({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    material: new BasicMaterial({ fillColor: state.fillColor })
  });
  scene.add(rect);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 420, state.x, (value) => {
      state.x = value;
      updateDemo(raw2dCanvas, scene, camera, rect, state, code);
    }),
    createRangeControl("Y", 0, 220, state.y, (value) => {
      state.y = value;
      updateDemo(raw2dCanvas, scene, camera, rect, state, code);
    }),
    createRangeControl("Width", 40, 360, state.width, (value) => {
      state.width = value;
      updateDemo(raw2dCanvas, scene, camera, rect, state, code);
    }),
    createRangeControl("Height", 30, 180, state.height, (value) => {
      state.height = value;
      updateDemo(raw2dCanvas, scene, camera, rect, state, code);
    }),
    createColorControl("Fill Color", state.fillColor, (value) => {
      state.fillColor = value;
      updateDemo(raw2dCanvas, scene, camera, rect, state, code);
    })
  );

  section.append(title, body, canvasElement, controls, pre);
  updateDemo(raw2dCanvas, scene, camera, rect, state, code);
  return section;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
}

function createRangeControl(
  label: string,
  min: number,
  max: number,
  value: number,
  onInput: (value: number) => void
): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "shape-demo-control";

  const text = document.createElement("span");
  text.textContent = `${label}: ${value}`;

  const input = document.createElement("input");
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);

  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    text.textContent = `${label}: ${nextValue}`;
    onInput(nextValue);
  });

  wrapper.append(text, input);
  return wrapper;
}

function createColorControl(
  label: string,
  value: string,
  onInput: (value: string) => void
): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "shape-demo-control";
  const text = document.createElement("span");
  const input = document.createElement("input");

  text.textContent = `${label}: ${value}`;
  input.type = "color";
  input.value = value;
  input.addEventListener("input", () => {
    text.textContent = `${label}: ${input.value}`;
    onInput(input.value);
  });

  wrapper.append(text, input);
  return wrapper;
}

function updateDemo(
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  rect: Rect,
  state: RectDemoState,
  codeElement: HTMLElement
): void {
  rect.setSize(state.width, state.height);
  rect.setPosition(state.x, state.y);
  rect.material.setFillColor(state.fillColor);
  raw2dCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: RectDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: ${state.x},
  y: ${state.y},
  width: ${state.width},
  height: ${state.height},
  material: new BasicMaterial({ fillColor: "${state.fillColor}" })
});

rect.setSize(${state.width}, ${state.height});
scene.add(rect);
raw2dCanvas.render(scene, camera);`;
}
