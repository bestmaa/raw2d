import { BasicMaterial, Camera2D, Canvas, Scene, Text2D } from "raw2d";
import type { Text2DDemoState } from "./Text2DDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createText2DDemo(): HTMLElement {
  const state: Text2DDemoState = {
    x: 80,
    y: 135,
    text: "Hello Raw2D",
    fontSize: 32,
    fillColor: "#f5f7fb"
  };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "shape-demo-canvas";
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  pre.append(code);

  const rawCanvas = new Canvas({
    canvas: canvasElement,
    width: demoCanvasWidth,
    height: demoCanvasHeight,
    backgroundColor: "#10141c"
  });
  const scene = new Scene();
  const camera = new Camera2D();
  const text = new Text2D({
    x: state.x,
    y: state.y,
    text: state.text,
    font: `${state.fontSize}px sans-serif`,
    material: new BasicMaterial({ fillColor: state.fillColor })
  });

  scene.add(text);
  section.append(createTitle(), canvasElement);
  section.append(createControls(state, rawCanvas, scene, camera, text, code), pre);
  updateDemo(rawCanvas, scene, camera, text, state, code);
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Text2D Controls";
  body.textContent = "Change text and font size. Text2D updates, then the canvas redraws.";
  fragment.append(title, body);
  return fragment;
}

function createControls(
  state: Text2DDemoState,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  text: Text2D,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(createRangeInput("X", 0, 420, state.x, (value) => {
    state.x = value;
    updateDemo(rawCanvas, scene, camera, text, state, code);
  }));
  controls.append(createRangeInput("Y", 20, 240, state.y, (value) => {
    state.y = value;
    updateDemo(rawCanvas, scene, camera, text, state, code);
  }));
  controls.append(createTextInput(state, rawCanvas, scene, camera, text, code));
  controls.append(createFontInput(state, rawCanvas, scene, camera, text, code));
  controls.append(createColorInput("Fill Color", state.fillColor, (value) => {
    state.fillColor = value;
    updateDemo(rawCanvas, scene, camera, text, state, code);
  }));
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
}

function createTextInput(
  state: Text2DDemoState,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  text: Text2D,
  code: HTMLElement
): HTMLElement {
  const label = document.createElement("label");
  label.className = "shape-demo-control";
  label.textContent = "Text";
  const input = document.createElement("input");
  input.type = "text";
  input.value = state.text;
  input.addEventListener("input", () => {
    state.text = input.value;
    updateDemo(rawCanvas, scene, camera, text, state, code);
  });
  label.append(input);
  return label;
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
  span.textContent = `${labelText}: ${value}`;
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);
  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    span.textContent = `${labelText}: ${nextValue}`;
    onInput(nextValue);
  });
  label.append(span, input);
  return label;
}

function createFontInput(
  state: Text2DDemoState,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  text: Text2D,
  code: HTMLElement
): HTMLElement {
  const label = document.createElement("label");
  label.className = "shape-demo-control";
  const span = document.createElement("span");
  const input = document.createElement("input");
  span.textContent = `Font Size: ${state.fontSize}`;
  input.type = "range";
  input.min = "12";
  input.max = "64";
  input.value = String(state.fontSize);
  input.addEventListener("input", () => {
    state.fontSize = Number(input.value);
    span.textContent = `Font Size: ${state.fontSize}`;
    updateDemo(rawCanvas, scene, camera, text, state, code);
  });
  label.append(span, input);
  return label;
}

function createColorInput(
  labelText: string,
  value: string,
  onInput: (value: string) => void
): HTMLElement {
  const label = document.createElement("label");
  label.className = "shape-demo-control";
  const span = document.createElement("span");
  const input = document.createElement("input");
  span.textContent = `${labelText}: ${value}`;
  input.type = "color";
  input.value = value;
  input.addEventListener("input", () => {
    span.textContent = `${labelText}: ${input.value}`;
    onInput(input.value);
  });
  label.append(span, input);
  return label;
}

function updateDemo(
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  text: Text2D,
  state: Text2DDemoState,
  codeElement: HTMLElement
): void {
  text.setPosition(state.x, state.y);
  text.setText(state.text);
  text.setFont(`${state.fontSize}px sans-serif`);
  text.material.setFillColor(state.fillColor);
  rawCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: Text2DDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Scene, Text2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const text = new Text2D({
  x: ${state.x},
  y: ${state.y},
  text: "${state.text}",
  font: "${state.fontSize}px sans-serif",
  material: new BasicMaterial({ fillColor: "${state.fillColor}" })
});

scene.add(text);
rawCanvas.render(scene, camera);`;
}
