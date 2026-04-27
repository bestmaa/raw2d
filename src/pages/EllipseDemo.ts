import { BasicMaterial, Camera2D, Canvas, Ellipse, Scene } from "raw2d";
import type { EllipseDemoState } from "./EllipseDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createEllipseDemo(): HTMLElement {
  const state: EllipseDemoState = { x: 260, y: 130, radiusX: 95, radiusY: 52, fillColor: "#a78bfa" };
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
  const ellipse = new Ellipse({
    x: state.x,
    y: state.y,
    radiusX: state.radiusX,
    radiusY: state.radiusY,
    material: new BasicMaterial({ fillColor: state.fillColor })
  });
  scene.add(ellipse);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 520, state.x, (value) => updateNumber(state, "x", value, raw2dCanvas, scene, camera, ellipse, code)),
    createRangeControl("Y", 0, 260, state.y, (value) => updateNumber(state, "y", value, raw2dCanvas, scene, camera, ellipse, code)),
    createRangeControl("Radius X", 10, 180, state.radiusX, (value) =>
      updateNumber(state, "radiusX", value, raw2dCanvas, scene, camera, ellipse, code)
    ),
    createRangeControl("Radius Y", 10, 120, state.radiusY, (value) =>
      updateNumber(state, "radiusY", value, raw2dCanvas, scene, camera, ellipse, code)
    ),
    createColorControl("Fill Color", state.fillColor, (value) => {
      state.fillColor = value;
      updateDemo(raw2dCanvas, scene, camera, ellipse, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(raw2dCanvas, scene, camera, ellipse, state, code);
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
  title.textContent = "Live Ellipse Controls";
  body.textContent = "Change radiusX and radiusY. The Ellipse data updates, then the canvas redraws.";
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

function createColorControl(label: string, value: string, onInput: (value: string) => void): HTMLElement {
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

function updateNumber(
  state: EllipseDemoState,
  key: "x" | "y" | "radiusX" | "radiusY",
  value: number,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  ellipse: Ellipse,
  codeElement: HTMLElement
): void {
  state[key] = value;
  updateDemo(raw2dCanvas, scene, camera, ellipse, state, codeElement);
}

function updateDemo(
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  ellipse: Ellipse,
  state: EllipseDemoState,
  codeElement: HTMLElement
): void {
  ellipse.setPosition(state.x, state.y);
  ellipse.setRadii(state.radiusX, state.radiusY);
  ellipse.material.setFillColor(state.fillColor);
  raw2dCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: EllipseDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Ellipse, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const ellipse = new Ellipse({
  x: ${state.x},
  y: ${state.y},
  radiusX: ${state.radiusX},
  radiusY: ${state.radiusY},
  material: new BasicMaterial({ fillColor: "${state.fillColor}" })
});

ellipse.setRadii(${state.radiusX}, ${state.radiusY});
scene.add(ellipse);
raw2dCanvas.render(scene, camera);`;
}
