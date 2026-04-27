import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Rect,
  Scene,
  SelectionManager,
  getSelectionBounds,
  pickObject
} from "raw2d";
import type { SelectionBoundsObject, SelectionDemoState } from "./SelectionDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createSelectionDemo(): HTMLElement {
  const state: SelectionDemoState = { selection: new SelectionManager(), selectedName: "none" };
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";

  const title = document.createElement("h2");
  title.textContent = "Live Selection Controls";

  const body = document.createElement("p");
  body.textContent = "Click an object to select it. Hold Shift while clicking to toggle multi-selection.";

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

  section.append(title, body, canvasElement, pre);
  renderDemo(raw2dCanvas, scene, camera, state, code);
  return section;
}

function addObjects(scene: Scene): void {
  scene.add(
    new Rect({
      name: "card",
      x: 120,
      y: 78,
      width: 180,
      height: 104,
      material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.74)" })
    })
  );
  scene.add(
    new Circle({
      name: "badge",
      x: 345,
      y: 132,
      radius: 58,
      material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.74)" })
    })
  );
}

function bindPointerEvents(options: {
  readonly canvasElement: HTMLCanvasElement;
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: SelectionDemoState;
  readonly code: HTMLElement;
}): void {
  options.canvasElement.addEventListener("pointerdown", (event) => {
    const point = getCanvasPoint(options.canvasElement, event);
    const picked = pickObject({ scene: options.scene, x: point.x, y: point.y });

    if (picked) {
      options.state.selection.select(picked, { append: event.shiftKey, toggle: event.shiftKey });
    } else if (!event.shiftKey) {
      options.state.selection.clear();
    }

    options.state.selectedName = getSelectionName(options.state.selection.getSelected());
    renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
  });
}

function getCanvasPoint(canvasElement: HTMLCanvasElement, event: PointerEvent): { readonly x: number; readonly y: number } {
  const bounds = canvasElement.getBoundingClientRect();

  return {
    x: Math.round(((event.clientX - bounds.left) / bounds.width) * demoCanvasWidth),
    y: Math.round(((event.clientY - bounds.top) / bounds.height) * demoCanvasHeight)
  };
}

function renderDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, state: SelectionDemoState, code: HTMLElement): void {
  raw2dCanvas.render(scene, camera);
  drawSelectionBounds(raw2dCanvas.getContext(), state);
  code.textContent = createCode(state);
}

function drawSelectionBounds(context: CanvasRenderingContext2D, state: SelectionDemoState): void {
  const bounds = getSelectionBounds({ objects: getBoundsObjects(state) });

  if (!bounds) {
    return;
  }

  context.save();
  context.strokeStyle = "#facc15";
  context.lineWidth = 2;
  context.setLineDash([7, 5]);
  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.fillStyle = "#facc15";
  context.font = "14px monospace";
  context.fillText(`selected: ${state.selectedName}`, bounds.x, Math.max(18, bounds.y - 8));
  context.restore();
}

function getBoundsObjects(state: SelectionDemoState): readonly SelectionBoundsObject[] {
  return state.selection.getSelected().filter((object): object is SelectionBoundsObject => object instanceof Rect || object instanceof Circle);
}

function getSelectionName(objects: readonly { readonly name: string; readonly id: string }[]): string {
  if (objects.length === 0) {
    return "none";
  }

  return objects.map((object) => object.name || object.id).join(", ");
}

function createCode(state: SelectionDemoState): string {
  return `const selection = new SelectionManager();

const picked = pickObject({ scene, x: pointerX, y: pointerY });

if (picked) {
  selection.select(picked, {
    append: event.shiftKey,
    toggle: event.shiftKey
  });
}

const bounds = getSelectionBounds({
  objects: [card, badge]
});

// Selected: ${state.selectedName}`;
}
