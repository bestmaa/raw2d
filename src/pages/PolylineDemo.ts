import { BasicMaterial, Camera2D, Canvas, Polyline, Scene } from "raw2d";
import type { PolylinePoint } from "raw2d";
import type { PolylineDemoState } from "./PolylineDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createPolylineDemo(): HTMLElement {
  const state: PolylineDemoState = {
    x: 85,
    y: 70,
    pointAX: 0,
    pointAY: 120,
    pointBX: 120,
    pointBY: 20,
    pointCX: 320,
    pointCY: 150,
    strokeColor: "#38bdf8",
    lineWidth: 6
  };
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);

  const rawCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const polyline = new Polyline({
    x: state.x,
    y: state.y,
    points: createPoints(state),
    material: new BasicMaterial({ strokeColor: state.strokeColor, lineWidth: state.lineWidth })
  });
  scene.add(polyline);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 220, state.x, (value) => updateNumber(state, "x", value, rawCanvas, scene, camera, polyline, code)),
    createRangeControl("Y", 0, 160, state.y, (value) => updateNumber(state, "y", value, rawCanvas, scene, camera, polyline, code)),
    createRangeControl("Point B Y", 0, 180, state.pointBY, (value) =>
      updateNumber(state, "pointBY", value, rawCanvas, scene, camera, polyline, code)
    ),
    createRangeControl("Point C X", 180, 420, state.pointCX, (value) =>
      updateNumber(state, "pointCX", value, rawCanvas, scene, camera, polyline, code)
    ),
    createRangeControl("Line Width", 1, 24, state.lineWidth, (value) =>
      updateNumber(state, "lineWidth", value, rawCanvas, scene, camera, polyline, code)
    ),
    createColorControl("Stroke Color", state.strokeColor, (value) => {
      state.strokeColor = value;
      updateDemo(rawCanvas, scene, camera, polyline, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(rawCanvas, scene, camera, polyline, state, code);
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Polyline Controls";
  body.textContent = "Polyline connects multiple points without closing the path.";
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
  state: PolylineDemoState,
  key: "x" | "y" | "pointBY" | "pointCX" | "lineWidth",
  value: number,
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  polyline: Polyline,
  codeElement: HTMLElement
): void {
  state[key] = value;
  updateDemo(rawCanvas, scene, camera, polyline, state, codeElement);
}

function updateDemo(
  rawCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  polyline: Polyline,
  state: PolylineDemoState,
  codeElement: HTMLElement
): void {
  polyline.setPosition(state.x, state.y);
  polyline.setPoints(createPoints(state));
  polyline.material.setStrokeColor(state.strokeColor);
  polyline.material.setLineWidth(state.lineWidth);
  rawCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createPoints(state: PolylineDemoState): readonly PolylinePoint[] {
  return [
    { x: state.pointAX, y: state.pointAY },
    { x: state.pointBX, y: state.pointBY },
    { x: state.pointCX, y: state.pointCY }
  ];
}

function createCode(state: PolylineDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Polyline, Scene } from "raw2d";

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const polyline = new Polyline({
  x: ${state.x},
  y: ${state.y},
  points: [
    { x: ${state.pointAX}, y: ${state.pointAY} },
    { x: ${state.pointBX}, y: ${state.pointBY} },
    { x: ${state.pointCX}, y: ${state.pointCY} }
  ],
  material: new BasicMaterial({
    strokeColor: "${state.strokeColor}",
    lineWidth: ${state.lineWidth}
  })
});

scene.add(polyline);
rawCanvas.render(scene, camera);`;
}
