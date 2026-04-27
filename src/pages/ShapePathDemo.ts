import { BasicMaterial, Camera2D, Canvas, Scene, ShapePath } from "raw2d";
import type { ShapePathDemoState } from "./ShapePathDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createShapePathDemo(): HTMLElement {
  const state: ShapePathDemoState = {
    x: 105,
    y: 55,
    curveX: 260,
    curveY: 18,
    fillColor: "#38bdf8",
    strokeColor: "#f5f7fb",
    lineWidth: 3
  };
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);

  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const shapePath = new ShapePath({
    x: state.x,
    y: state.y,
    material: new BasicMaterial({ fillColor: state.fillColor, strokeColor: state.strokeColor, lineWidth: state.lineWidth })
  });
  scene.add(shapePath);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 220, state.x, (value) => updateNumber(state, "x", value, raw2dCanvas, scene, camera, shapePath, code)),
    createRangeControl("Y", 0, 150, state.y, (value) => updateNumber(state, "y", value, raw2dCanvas, scene, camera, shapePath, code)),
    createRangeControl("Curve X", 120, 360, state.curveX, (value) =>
      updateNumber(state, "curveX", value, raw2dCanvas, scene, camera, shapePath, code)
    ),
    createRangeControl("Curve Y", -40, 130, state.curveY, (value) =>
      updateNumber(state, "curveY", value, raw2dCanvas, scene, camera, shapePath, code)
    ),
    createRangeControl("Line Width", 0, 18, state.lineWidth, (value) =>
      updateNumber(state, "lineWidth", value, raw2dCanvas, scene, camera, shapePath, code)
    ),
    createColorControl("Fill Color", state.fillColor, (value) => {
      state.fillColor = value;
      updateDemo(raw2dCanvas, scene, camera, shapePath, state, code);
    }),
    createColorControl("Stroke Color", state.strokeColor, (value) => {
      state.strokeColor = value;
      updateDemo(raw2dCanvas, scene, camera, shapePath, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(raw2dCanvas, scene, camera, shapePath, state, code);
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live ShapePath Controls";
  body.textContent = "ShapePath stores explicit path commands for custom low-level geometry.";
  fragment.append(title, body);
  return fragment;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
}

function createRangeControl(label: string, min: number, max: number, value: number, onInput: (value: number) => void): HTMLElement {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  wrapper.className = "shape-demo-control";
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
  const text = document.createElement("span");
  const input = document.createElement("input");
  wrapper.className = "shape-demo-control";
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
  state: ShapePathDemoState,
  key: "x" | "y" | "curveX" | "curveY" | "lineWidth",
  value: number,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  shapePath: ShapePath,
  codeElement: HTMLElement
): void {
  state[key] = value;
  updateDemo(raw2dCanvas, scene, camera, shapePath, state, codeElement);
}

function updateDemo(
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  shapePath: ShapePath,
  state: ShapePathDemoState,
  codeElement: HTMLElement
): void {
  shapePath.setPosition(state.x, state.y);
  shapePath.clear();
  buildPath(shapePath, state);
  shapePath.material.setFillColor(state.fillColor);
  shapePath.material.setStrokeColor(state.strokeColor);
  shapePath.material.setLineWidth(state.lineWidth);
  raw2dCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function buildPath(shapePath: ShapePath, state: ShapePathDemoState): void {
  shapePath
    .moveTo(0, 95)
    .quadraticCurveTo(state.curveX, state.curveY, 300, 95)
    .bezierCurveTo(255, 190, 45, 190, 0, 95)
    .closePath();
}

function createCode(state: ShapePathDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Scene, ShapePath } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const shapePath = new ShapePath({
  x: ${state.x},
  y: ${state.y},
  material: new BasicMaterial({
    fillColor: "${state.fillColor}",
    strokeColor: "${state.strokeColor}",
    lineWidth: ${state.lineWidth}
  })
});

shapePath
  .moveTo(0, 95)
  .quadraticCurveTo(${state.curveX}, ${state.curveY}, 300, 95)
  .bezierCurveTo(255, 190, 45, 190, 0, 95)
  .closePath();

scene.add(shapePath);
raw2dCanvas.render(scene, camera);`;
}
