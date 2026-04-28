import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
import type { RenderOrderDemoState } from "./RenderOrderDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createRenderOrderDemo(): HTMLElement {
  const state: RenderOrderDemoState = { backZIndex: 0, middleZIndex: 1, frontZIndex: 2 };
  const section = document.createElement("article");
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const rects = createRects(scene);

  section.className = "doc-section shape-demo";
  title.textContent = "Live Render Order";
  body.textContent = "Change zIndex values. Higher zIndex draws later, so it appears on top.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(title, body, canvasElement, createControls(state, raw2dCanvas, scene, rects, code), pre);
  updateDemo(raw2dCanvas, scene, rects, state, code);
  return section;
}

function createRects(scene: Scene): readonly Rect[] {
  const rects = [
    new Rect({ name: "blue", x: 120, y: 78, width: 150, height: 105, material: new BasicMaterial({ fillColor: "#35c2ff" }) }),
    new Rect({ name: "yellow", x: 185, y: 102, width: 150, height: 105, material: new BasicMaterial({ fillColor: "#facc15" }) }),
    new Rect({ name: "red", x: 250, y: 62, width: 150, height: 105, material: new BasicMaterial({ fillColor: "#f45b69" }) })
  ];

  for (const rect of rects) {
    scene.add(rect);
  }

  return rects;
}

function createControls(
  state: RenderOrderDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  rects: readonly Rect[],
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Blue zIndex", -3, 6, state.backZIndex, (value) => updateState("backZIndex", value, state, raw2dCanvas, scene, rects, code)),
    createRangeControl("Yellow zIndex", -3, 6, state.middleZIndex, (value) => updateState("middleZIndex", value, state, raw2dCanvas, scene, rects, code)),
    createRangeControl("Red zIndex", -3, 6, state.frontZIndex, (value) => updateState("frontZIndex", value, state, raw2dCanvas, scene, rects, code))
  );
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Render Order";
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

function updateState(
  key: keyof RenderOrderDemoState,
  value: number,
  state: RenderOrderDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  rects: readonly Rect[],
  code: HTMLElement
): void {
  state[key] = value;
  updateDemo(raw2dCanvas, scene, rects, state, code);
}

function updateDemo(raw2dCanvas: Canvas, scene: Scene, rects: readonly Rect[], state: RenderOrderDemoState, code: HTMLElement): void {
  rects[0]?.setZIndex(state.backZIndex);
  rects[1]?.setZIndex(state.middleZIndex);
  rects[2]?.setZIndex(state.frontZIndex);
  raw2dCanvas.render(scene, new Camera2D());
  code.textContent = createCode(state);
}

function createCode(state: RenderOrderDemoState): string {
  return `blue.setZIndex(${state.backZIndex});
yellow.setZIndex(${state.middleZIndex});
red.setZIndex(${state.frontZIndex});

raw2dCanvas.render(scene, camera);`;
}
