import { Arc, BasicMaterial, Camera2D, Canvas, Scene } from "raw2d";
import type { ArcDemoState } from "./ArcDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createArcDemo(): HTMLElement {
  const state: ArcDemoState = {
    x: 260,
    y: 130,
    radiusX: 110,
    radiusY: 70,
    startAngle: 0,
    endAngle: Math.PI * 1.35,
    lineWidth: 8,
    strokeColor: "#f97316",
    closed: false
  };
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
  const arc = new Arc({
    x: state.x,
    y: state.y,
    radiusX: state.radiusX,
    radiusY: state.radiusY,
    startAngle: state.startAngle,
    endAngle: state.endAngle,
    closed: state.closed,
    material: new BasicMaterial({ strokeColor: state.strokeColor, fillColor: state.strokeColor, lineWidth: state.lineWidth })
  });
  scene.add(arc);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 520, state.x, (value) => updateNumber(state, "x", value, raw2dCanvas, scene, camera, arc, code)),
    createRangeControl("Y", 0, 260, state.y, (value) => updateNumber(state, "y", value, raw2dCanvas, scene, camera, arc, code)),
    createRangeControl("Radius X", 10, 180, state.radiusX, (value) =>
      updateNumber(state, "radiusX", value, raw2dCanvas, scene, camera, arc, code)
    ),
    createRangeControl("Radius Y", 10, 120, state.radiusY, (value) =>
      updateNumber(state, "radiusY", value, raw2dCanvas, scene, camera, arc, code)
    ),
    createAngleControl("Start Angle", 0, Math.PI * 2, state.startAngle, (value) =>
      updateNumber(state, "startAngle", value, raw2dCanvas, scene, camera, arc, code)
    ),
    createAngleControl("End Angle", 0, Math.PI * 2, state.endAngle, (value) =>
      updateNumber(state, "endAngle", value, raw2dCanvas, scene, camera, arc, code)
    ),
    createRangeControl("Line Width", 1, 24, state.lineWidth, (value) =>
      updateNumber(state, "lineWidth", value, raw2dCanvas, scene, camera, arc, code)
    ),
    createColorControl("Stroke Color", state.strokeColor, (value) => {
      state.strokeColor = value;
      updateDemo(raw2dCanvas, scene, camera, arc, state, code);
    }),
    createCheckboxControl("Closed", state.closed, (value) => {
      state.closed = value;
      updateDemo(raw2dCanvas, scene, camera, arc, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(raw2dCanvas, scene, camera, arc, state, code);
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
  title.textContent = "Live Arc Controls";
  body.textContent = "Change angles and radii. The Arc data updates, then the canvas redraws.";
  fragment.append(title, body);
  return fragment;
}

function createRangeControl(label: string, min: number, max: number, value: number, onInput: (value: number) => void): HTMLElement {
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

function createAngleControl(label: string, min: number, max: number, value: number, onInput: (value: number) => void): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "shape-demo-control";
  const text = document.createElement("span");
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.step = "0.01";
  input.value = String(value);
  text.textContent = `${label}: ${value.toFixed(2)}`;
  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    text.textContent = `${label}: ${nextValue.toFixed(2)}`;
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

function createCheckboxControl(label: string, value: boolean, onInput: (value: boolean) => void): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "shape-demo-control shape-demo-check";
  const input = document.createElement("input");
  const text = document.createElement("span");
  input.type = "checkbox";
  input.checked = value;
  text.textContent = label;
  input.addEventListener("input", () => onInput(input.checked));
  wrapper.append(input, text);
  return wrapper;
}

function updateNumber(
  state: ArcDemoState,
  key: "x" | "y" | "radiusX" | "radiusY" | "startAngle" | "endAngle" | "lineWidth",
  value: number,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  arc: Arc,
  codeElement: HTMLElement
): void {
  state[key] = value;
  updateDemo(raw2dCanvas, scene, camera, arc, state, codeElement);
}

function updateDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, arc: Arc, state: ArcDemoState, codeElement: HTMLElement): void {
  arc.setPosition(state.x, state.y);
  arc.setRadii(state.radiusX, state.radiusY);
  arc.setAngles(state.startAngle, state.endAngle);
  arc.closed = state.closed;
  arc.material.setStrokeColor(state.strokeColor);
  arc.material.setFillColor(state.strokeColor);
  arc.material.setLineWidth(state.lineWidth);
  raw2dCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: ArcDemoState): string {
  return `import { Arc, BasicMaterial, Camera2D, Canvas, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const arc = new Arc({
  x: ${state.x},
  y: ${state.y},
  radiusX: ${state.radiusX},
  radiusY: ${state.radiusY},
  startAngle: ${state.startAngle.toFixed(2)},
  endAngle: ${state.endAngle.toFixed(2)},
  closed: ${state.closed},
  material: new BasicMaterial({
    strokeColor: "${state.strokeColor}",
    fillColor: "${state.strokeColor}",
    lineWidth: ${state.lineWidth}
  })
});

scene.add(arc);
raw2dCanvas.render(scene, camera);`;
}
