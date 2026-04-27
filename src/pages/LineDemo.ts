import { Camera2D, Canvas, Scene } from "../core";
import { BasicMaterial } from "../materials";
import { Line } from "../objects";
import type { LineDemoState } from "./LineDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createLineDemo(): HTMLElement {
  const state: LineDemoState = {
    x: 100,
    y: 120,
    startX: 0,
    startY: 0,
    endX: 300,
    endY: 90,
    strokeColor: "#facc15",
    lineWidth: 6
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

  const line = new Line({
    x: state.x,
    y: state.y,
    startX: state.startX,
    startY: state.startY,
    endX: state.endX,
    endY: state.endY,
    material: new BasicMaterial({
      strokeColor: state.strokeColor,
      lineWidth: state.lineWidth
    })
  });
  scene.add(line);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 420, state.x, (value) => {
      state.x = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createRangeControl("Y", 0, 220, state.y, (value) => {
      state.y = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createRangeControl("Start X", -160, 160, state.startX, (value) => {
      state.startX = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createRangeControl("Start Y", -120, 120, state.startY, (value) => {
      state.startY = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createRangeControl("End X", 40, 360, state.endX, (value) => {
      state.endX = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createRangeControl("End Y", -80, 120, state.endY, (value) => {
      state.endY = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createRangeControl("Line Width", 1, 24, state.lineWidth, (value) => {
      state.lineWidth = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    }),
    createColorControl("Stroke Color", state.strokeColor, (value) => {
      state.strokeColor = value;
      updateDemo(rawCanvas, scene, camera, line, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(rawCanvas, scene, camera, line, state, code);
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
  title.textContent = "Live Line Controls";
  body.textContent = "Change the local end point. The Line data updates, then the canvas redraws.";
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
  line: Line,
  state: LineDemoState,
  codeElement: HTMLElement
): void {
  line.setPosition(state.x, state.y);
  line.setPoints(state.startX, state.startY, state.endX, state.endY);
  line.material.setStrokeColor(state.strokeColor);
  line.material.setLineWidth(state.lineWidth);
  rawCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createCode(state: LineDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Line, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const line = new Line({
  x: ${state.x},
  y: ${state.y},
  startX: ${state.startX},
  startY: ${state.startY},
  endX: ${state.endX},
  endY: ${state.endY},
  material: new BasicMaterial({
    strokeColor: "${state.strokeColor}",
    lineWidth: ${state.lineWidth}
  })
});

line.setPoints(${state.startX}, ${state.startY}, ${state.endX}, ${state.endY});
scene.add(line);
rawCanvas.render(scene, camera);`;
}
