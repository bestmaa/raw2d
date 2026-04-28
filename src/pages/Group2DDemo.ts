import { BasicMaterial, Camera2D, Canvas, Circle, Group2D, Rect, Scene } from "raw2d";
import type { Group2DDemoState } from "./Group2DDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createGroup2DDemo(): HTMLElement {
  const state: Group2DDemoState = { groupX: 240, groupY: 130, rotation: 0 };
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const group = createGroup(scene, state);

  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(createTitle(), createBody(), canvasElement, createControls(state, raw2dCanvas, scene, camera, group, code), pre);
  updateDemo(raw2dCanvas, scene, camera, group, state, code);
  return section;
}

function createTitle(): HTMLElement {
  const title = document.createElement("h2");
  title.textContent = "Live Group2D Controls";
  return title;
}

function createBody(): HTMLElement {
  const body = document.createElement("p");
  body.textContent = "Move or rotate the group. Both child objects follow the group transform.";
  return body;
}

function createGroup(scene: Scene, state: Group2DDemoState): Group2D {
  const group = new Group2D({ x: state.groupX, y: state.groupY });
  group.add(new Rect({ x: -95, y: -48, width: 130, height: 96, material: new BasicMaterial({ fillColor: "#35c2ff" }) }));
  group.add(new Circle({ x: 70, y: 0, radius: 48, material: new BasicMaterial({ fillColor: "#f45b69" }) }));
  scene.add(group);
  return group;
}

function createControls(
  state: Group2DDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  group: Group2D,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Group X", 80, 440, state.groupX, (value) => updateState("groupX", value, state, raw2dCanvas, scene, camera, group, code)),
    createRangeControl("Group Y", 60, 210, state.groupY, (value) => updateState("groupY", value, state, raw2dCanvas, scene, camera, group, code)),
    createRangeControl("Rotation", -3.14, 3.14, state.rotation, (value) => updateState("rotation", value, state, raw2dCanvas, scene, camera, group, code), 0.01)
  );
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Group Transform";
  return title;
}

function createRangeControl(label: string, min: number, max: number, value: number, onInput: (value: number) => void, step = 1): HTMLElement {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  wrapper.className = "shape-demo-control";
  text.textContent = `${label}: ${value}`;
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
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
  key: keyof Group2DDemoState,
  value: number,
  state: Group2DDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  group: Group2D,
  code: HTMLElement
): void {
  state[key] = value;
  updateDemo(raw2dCanvas, scene, camera, group, state, code);
}

function updateDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, group: Group2D, state: Group2DDemoState, code: HTMLElement): void {
  group.setPosition(state.groupX, state.groupY);
  group.rotation = state.rotation;
  raw2dCanvas.render(scene, camera);
  code.textContent = createCode(state);
}

function createCode(state: Group2DDemoState): string {
  return `const group = new Group2D({
  x: ${state.groupX},
  y: ${state.groupY},
  rotation: ${state.rotation}
});

group.add(rect);
group.add(circle);
scene.add(group);`;
}
