import { BasicMaterial, Camera2D, Canvas, Circle, Scene } from "raw2d";
import type { CircleDemoState } from "./CircleDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createCircleDemo(): HTMLElement {
  const state: CircleDemoState = { x: 260, y: 130, radius: 64, fillColor: "#35c2ff" };
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

  const circle = new Circle({
    x: state.x,
    y: state.y,
    radius: state.radius,
    material: new BasicMaterial({ fillColor: state.fillColor })
  });
  scene.add(circle);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 520, state.x, (value) => {
      state.x = value;
      updateDemo(rawCanvas, scene, camera, circle, state, code);
    }),
    createRangeControl("Y", 0, 260, state.y, (value) => {
      state.y = value;
      updateDemo(rawCanvas, scene, camera, circle, state, code);
    }),
    createRangeControl("Radius", 20, 120, state.radius, (value) => {
      state.radius = value;
      updateDemo(rawCanvas, scene, camera, circle, state, code);
    }),
    createColorControl("Fill Color", state.fillColor, (value) => {
      state.fillColor = value;
      updateDemo(rawCanvas, scene, camera, circle, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(rawCanvas, scene, camera, circle, state, code);
  return section;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Circle Controls";
  body.textContent = "Change radius. The Circle data updates, then the canvas redraws.";
  fragment.append(title, body);
  return fragment;
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
  const input = document.createElement("input");

  text.textContent = `${label}: ${value}`;
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
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  circle: Circle,
  state: CircleDemoState,
  codeElement: HTMLElement
): void {
  circle.setPosition(state.x, state.y);
  circle.setRadius(state.radius);
  circle.material.setFillColor(state.fillColor);
  rawCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: CircleDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Circle, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const circle = new Circle({
  x: ${state.x},
  y: ${state.y},
  radius: ${state.radius},
  material: new BasicMaterial({ fillColor: "${state.fillColor}" })
});

circle.setRadius(${state.radius});
scene.add(circle);
rawCanvas.render(scene, camera);`;
}
