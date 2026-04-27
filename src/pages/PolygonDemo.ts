import { BasicMaterial, Camera2D, Canvas, Polygon, Scene } from "raw2d";
import type { PolygonPoint } from "raw2d";
import type { PolygonDemoState } from "./PolygonDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createPolygonDemo(): HTMLElement {
  const state: PolygonDemoState = {
    x: 110,
    y: 55,
    pointAX: 80,
    pointAY: 0,
    pointBX: 260,
    pointBY: 70,
    pointCX: 40,
    pointCY: 160,
    fillColor: "#22c55e",
    strokeColor: "#bbf7d0",
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
  const polygon = new Polygon({
    x: state.x,
    y: state.y,
    points: createPoints(state),
    material: new BasicMaterial({ fillColor: state.fillColor, strokeColor: state.strokeColor, lineWidth: state.lineWidth })
  });
  scene.add(polygon);

  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("X", 0, 220, state.x, (value) => updateNumber(state, "x", value, raw2dCanvas, scene, camera, polygon, code)),
    createRangeControl("Y", 0, 140, state.y, (value) => updateNumber(state, "y", value, raw2dCanvas, scene, camera, polygon, code)),
    createRangeControl("Point B X", 120, 360, state.pointBX, (value) =>
      updateNumber(state, "pointBX", value, raw2dCanvas, scene, camera, polygon, code)
    ),
    createRangeControl("Point C Y", 80, 220, state.pointCY, (value) =>
      updateNumber(state, "pointCY", value, raw2dCanvas, scene, camera, polygon, code)
    ),
    createRangeControl("Line Width", 0, 18, state.lineWidth, (value) =>
      updateNumber(state, "lineWidth", value, raw2dCanvas, scene, camera, polygon, code)
    ),
    createColorControl("Fill Color", state.fillColor, (value) => {
      state.fillColor = value;
      updateDemo(raw2dCanvas, scene, camera, polygon, state, code);
    }),
    createColorControl("Stroke Color", state.strokeColor, (value) => {
      state.strokeColor = value;
      updateDemo(raw2dCanvas, scene, camera, polygon, state, code);
    })
  );

  section.append(createTitle(), canvasElement, controls, pre);
  updateDemo(raw2dCanvas, scene, camera, polygon, state, code);
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Polygon Controls";
  body.textContent = "Polygon uses the same point list idea, then closes and fills the path.";
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
  state: PolygonDemoState,
  key: "x" | "y" | "pointBX" | "pointCY" | "lineWidth",
  value: number,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  polygon: Polygon,
  codeElement: HTMLElement
): void {
  state[key] = value;
  updateDemo(raw2dCanvas, scene, camera, polygon, state, codeElement);
}

function updateDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, polygon: Polygon, state: PolygonDemoState, codeElement: HTMLElement): void {
  polygon.setPosition(state.x, state.y);
  polygon.setPoints(createPoints(state));
  polygon.material.setFillColor(state.fillColor);
  polygon.material.setStrokeColor(state.strokeColor);
  polygon.material.setLineWidth(state.lineWidth);
  raw2dCanvas.render(scene, camera);
  codeElement.textContent = createCode(state);
}

function createPoints(state: PolygonDemoState): readonly PolygonPoint[] {
  return [
    { x: state.pointAX, y: state.pointAY },
    { x: state.pointBX, y: state.pointBY },
    { x: state.pointCX, y: state.pointCY }
  ];
}

function createCode(state: PolygonDemoState): string {
  return `import { BasicMaterial, Camera2D, Canvas, Polygon, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const polygon = new Polygon({
  x: ${state.x},
  y: ${state.y},
  points: [
    { x: ${state.pointAX}, y: ${state.pointAY} },
    { x: ${state.pointBX}, y: ${state.pointBY} },
    { x: ${state.pointCX}, y: ${state.pointCY} }
  ],
  material: new BasicMaterial({
    fillColor: "${state.fillColor}",
    strokeColor: "${state.strokeColor}",
    lineWidth: ${state.lineWidth}
  })
});

scene.add(polygon);
raw2dCanvas.render(scene, camera);`;
}
