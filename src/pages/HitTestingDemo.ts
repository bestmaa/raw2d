import { BasicMaterial, Camera2D, Canvas, Circle, Line, Polygon, Rect, Scene, pickObject } from "raw2d";
import type { HitTestingDemoObjects, HitTestingDemoState, HitTestingShapeName } from "./HitTestingDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createHitTestingDemo(): HTMLElement {
  const state: HitTestingDemoState = { x: 145, y: 112, hitName: "rect" };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";

  const title = document.createElement("h2");
  title.textContent = "Live Hit Testing";

  const body = document.createElement("p");
  body.textContent = "Move the test point. Raw2D checks which object contains that world-space point.";

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
  createObjects(scene);
  const controls = createControls(state, raw2dCanvas, scene, camera, code);

  canvasElement.addEventListener("pointermove", (event) => {
    const bounds = canvasElement.getBoundingClientRect();
    state.x = Math.round(((event.clientX - bounds.left) / bounds.width) * demoCanvasWidth);
    state.y = Math.round(((event.clientY - bounds.top) / bounds.height) * demoCanvasHeight);
    updateDemo(raw2dCanvas, scene, camera, state, code);
  });

  section.append(title, body, canvasElement, controls, pre);
  updateDemo(raw2dCanvas, scene, camera, state, code);
  return section;
}

function createObjects(scene: Scene): HitTestingDemoObjects {
  const rect = new Rect({
    name: "rect",
    x: 145,
    y: 112,
    width: 135,
    height: 78,
    origin: "center",
    rotation: 0.26,
    material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.72)" })
  });
  const circle = new Circle({
    name: "circle",
    x: 332,
    y: 96,
    radius: 48,
    material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.72)" })
  });
  const line = new Line({
    name: "line",
    x: 82,
    y: 206,
    endX: 220,
    endY: -24,
    material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 7 })
  });
  const polygon = new Polygon({
    name: "polygon",
    x: 356,
    y: 174,
    points: [
      { x: 0, y: -44 },
      { x: 74, y: -4 },
      { x: 48, y: 56 },
      { x: -42, y: 44 }
    ],
    material: new BasicMaterial({ fillColor: "rgba(52, 211, 153, 0.72)" })
  });

  scene.add(rect);
  scene.add(circle);
  scene.add(line);
  scene.add(polygon);
  return { rect, circle, line, polygon };
}

function createControls(
  state: HitTestingDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Pointer X", 0, demoCanvasWidth, state.x, (value) => {
      state.x = value;
      updateDemo(raw2dCanvas, scene, camera, state, code);
    }),
    createRangeControl("Pointer Y", 0, demoCanvasHeight, state.y, (value) => {
      state.y = value;
      updateDemo(raw2dCanvas, scene, camera, state, code);
    })
  );
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Parameters";
  return title;
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

function updateDemo(
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  state: HitTestingDemoState,
  code: HTMLElement
): void {
  state.hitName = getHitName(scene, state.x, state.y);
  raw2dCanvas.render(scene, camera);
  drawPointer(raw2dCanvas.getContext(), state);
  code.textContent = createCode(state);
}

function getHitName(scene: Scene, x: number, y: number): HitTestingShapeName {
  const picked = pickObject({ scene, x, y, tolerance: 8 });
  return getPickedName(picked?.name);
}

function drawPointer(context: CanvasRenderingContext2D, state: HitTestingDemoState): void {
  context.save();
  context.strokeStyle = state.hitName === "none" ? "#f5f7fb" : "#f97316";
  context.fillStyle = state.hitName === "none" ? "#f5f7fb" : "#f97316";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(state.x, state.y, 7, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(state.x, state.y, 2.5, 0, Math.PI * 2);
  context.fill();
  context.font = "14px monospace";
  context.fillText(`hit: ${state.hitName}`, state.x + 12, state.y - 10);
  context.restore();
}

function createCode(state: HitTestingDemoState): string {
  return `import { pickObject } from "raw2d";

const pointerX = ${state.x};
const pointerY = ${state.y};

const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY,
  tolerance: 8
});

// Current live result: ${state.hitName}`;
}

function getPickedName(name: string | undefined): HitTestingShapeName {
  if (name === "rect" || name === "circle" || name === "line" || name === "polygon") {
    return name;
  }

  return "none";
}
