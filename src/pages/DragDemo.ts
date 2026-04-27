import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Rect,
  Scene,
  endObjectDrag,
  pickObject,
  startObjectDrag,
  updateObjectDrag
} from "raw2d";
import type { CanvasPoint, DragDemoState } from "./DragDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createDragDemo(): HTMLElement {
  const state: DragDemoState = { dragState: null, selectedName: "none", pointerX: 0, pointerY: 0 };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";

  const title = document.createElement("h2");
  title.textContent = "Live Drag Controls";

  const body = document.createElement("p");
  body.textContent = "Pointer down on an object, move, then release. The object position updates through raw2d-interaction.";

  const canvasElement = document.createElement("canvas");
  canvasElement.className = "shape-demo-canvas";
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  pre.append(code);

  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  addObjects(scene);
  bindPointerEvents({ canvasElement, raw2dCanvas, scene, camera, state, code });

  section.append(title, body, canvasElement, createStatus(state), pre);
  renderDemo(raw2dCanvas, scene, camera, state, code);
  return section;
}

function addObjects(scene: Scene): void {
  scene.add(
    new Rect({
      name: "card",
      x: 120,
      y: 80,
      width: 170,
      height: 96,
      material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.74)" })
    })
  );
  scene.add(
    new Circle({
      name: "badge",
      x: 330,
      y: 130,
      radius: 56,
      material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.74)" })
    })
  );
}

function bindPointerEvents(options: {
  readonly canvasElement: HTMLCanvasElement;
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: DragDemoState;
  readonly code: HTMLElement;
}): void {
  options.canvasElement.addEventListener("pointerdown", (event) => {
    const point = getCanvasPoint(options.canvasElement, event);
    const picked = pickObject({ scene: options.scene, x: point.x, y: point.y });

    if (!picked) {
      return;
    }

    options.canvasElement.setPointerCapture(event.pointerId);
    options.state.dragState = startObjectDrag({ object: picked, pointerX: point.x, pointerY: point.y });
    options.state.selectedName = picked.name || picked.id;
    options.state.pointerX = point.x;
    options.state.pointerY = point.y;
    renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
  });

  options.canvasElement.addEventListener("pointermove", (event) => {
    if (!options.state.dragState) {
      return;
    }

    const point = getCanvasPoint(options.canvasElement, event);
    options.state.pointerX = point.x;
    options.state.pointerY = point.y;
    updateObjectDrag({ state: options.state.dragState, pointerX: point.x, pointerY: point.y });
    renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
  });

  options.canvasElement.addEventListener("pointerup", () => endDrag(options));
  options.canvasElement.addEventListener("pointercancel", () => endDrag(options));
}

function endDrag(options: {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: DragDemoState;
  readonly code: HTMLElement;
}): void {
  if (!options.state.dragState) {
    return;
  }

  endObjectDrag({ state: options.state.dragState });
  options.state.dragState = null;
  renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
}

function getCanvasPoint(canvasElement: HTMLCanvasElement, event: PointerEvent): CanvasPoint {
  const bounds = canvasElement.getBoundingClientRect();

  return {
    x: Math.round(((event.clientX - bounds.left) / bounds.width) * demoCanvasWidth),
    y: Math.round(((event.clientY - bounds.top) / bounds.height) * demoCanvasHeight)
  };
}

function createStatus(state: DragDemoState): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "shape-demo-controls";
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Status";
  const body = document.createElement("p");
  body.textContent = `Selected: ${state.selectedName}`;
  wrapper.append(title, body);
  return wrapper;
}

function renderDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, state: DragDemoState, code: HTMLElement): void {
  raw2dCanvas.render(scene, camera);
  drawStatus(raw2dCanvas.getContext(), state);
  code.textContent = createCode(state);
}

function drawStatus(context: CanvasRenderingContext2D, state: DragDemoState): void {
  context.save();
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`selected: ${state.selectedName}`, 16, 24);
  if (state.dragState) {
    context.fillStyle = "#f97316";
    context.beginPath();
    context.arc(state.pointerX, state.pointerY, 6, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function createCode(state: DragDemoState): string {
  return `const picked = pickObject({ scene, x: pointerX, y: pointerY });

if (picked) {
  dragState = startObjectDrag({ object: picked, pointerX, pointerY });
}

updateObjectDrag({ state: dragState, pointerX, pointerY });
raw2dCanvas.render(scene, camera);

// Selected: ${state.selectedName}`;
}
