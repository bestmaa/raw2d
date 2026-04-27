import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Rect,
  Scene,
  endObjectResize,
  getRectLocalBounds,
  getResizeHandles,
  getWorldBounds,
  pickResizeHandle,
  startObjectResize,
  updateObjectResize
} from "raw2d";
import type { Rectangle } from "raw2d";
import type { ResizeDemoPointerOptions, ResizeDemoState } from "./ResizeDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createResizeDemo(): HTMLElement {
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const rect = new Rect({
    name: "card",
    x: 155,
    y: 78,
    width: 190,
    height: 110,
    material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.74)" })
  });
  const state: ResizeDemoState = { rect, resizeState: null, hoveredHandleName: "none" };

  title.textContent = "Live Rect Resize";
  body.textContent = "Drag a resize handle. The Rect x/y/width/height update through raw2d-interaction.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  scene.add(rect);
  bindPointerEvents({ canvasElement, raw2dCanvas, scene, camera, state, code });
  section.append(title, body, canvasElement, pre);
  renderDemo(raw2dCanvas, scene, camera, state, code);
  return section;
}

function bindPointerEvents(options: {
  readonly canvasElement: HTMLCanvasElement;
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: ResizeDemoState;
  readonly code: HTMLElement;
}): void {
  options.canvasElement.addEventListener("pointerdown", (event) => {
    const point = getCanvasPoint({ canvasElement: options.canvasElement, event });
    const handle = pickResizeHandle({ handles: getCurrentHandles(options.state), x: point.x, y: point.y });

    if (!handle) {
      return;
    }

    options.canvasElement.setPointerCapture(event.pointerId);
    options.state.resizeState = startObjectResize({
      object: options.state.rect,
      handleName: handle.name,
      pointerX: point.x,
      pointerY: point.y,
      minWidth: 30,
      minHeight: 30
    });
    renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
  });

  options.canvasElement.addEventListener("pointermove", (event) => {
    const point = getCanvasPoint({ canvasElement: options.canvasElement, event });

    if (options.state.resizeState) {
      updateObjectResize({ state: options.state.resizeState, pointerX: point.x, pointerY: point.y });
    }

    const handle = pickResizeHandle({ handles: getCurrentHandles(options.state), x: point.x, y: point.y });
    options.state.hoveredHandleName = handle?.name ?? "none";
    options.canvasElement.style.cursor = handle?.cursor ?? "default";
    renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
  });

  options.canvasElement.addEventListener("pointerup", () => endResize(options));
  options.canvasElement.addEventListener("pointercancel", () => endResize(options));
}

function endResize(options: {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: ResizeDemoState;
  readonly code: HTMLElement;
}): void {
  if (!options.state.resizeState) {
    return;
  }

  endObjectResize({ state: options.state.resizeState });
  options.state.resizeState = null;
  renderDemo(options.raw2dCanvas, options.scene, options.camera, options.state, options.code);
}

function getCanvasPoint(options: ResizeDemoPointerOptions): { readonly x: number; readonly y: number } {
  const bounds = options.canvasElement.getBoundingClientRect();

  return {
    x: Math.round(((options.event.clientX - bounds.left) / bounds.width) * demoCanvasWidth),
    y: Math.round(((options.event.clientY - bounds.top) / bounds.height) * demoCanvasHeight)
  };
}

function renderDemo(raw2dCanvas: Canvas, scene: Scene, camera: Camera2D, state: ResizeDemoState, code: HTMLElement): void {
  raw2dCanvas.render(scene, camera);
  drawResizeOverlay(raw2dCanvas.getContext(), state);
  code.textContent = createCode(state);
}

function drawResizeOverlay(context: CanvasRenderingContext2D, state: ResizeDemoState): void {
  const bounds = getCurrentBounds(state);
  context.save();
  context.strokeStyle = "#facc15";
  context.lineWidth = 2;
  context.setLineDash([7, 5]);
  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.setLineDash([]);
  context.fillStyle = "#10141c";

  for (const handle of getCurrentHandles(state)) {
    context.fillRect(handle.x, handle.y, handle.width, handle.height);
    context.strokeRect(handle.x, handle.y, handle.width, handle.height);
  }

  context.fillStyle = "#facc15";
  context.font = "14px monospace";
  context.fillText(`handle: ${state.hoveredHandleName}`, bounds.x, Math.max(18, bounds.y - 8));
  context.restore();
}

function getCurrentBounds(state: ResizeDemoState): Rectangle {
  return getWorldBounds({ object: state.rect, localBounds: getRectLocalBounds(state.rect) });
}

function getCurrentHandles(state: ResizeDemoState): ReturnType<typeof getResizeHandles> {
  return getResizeHandles({ bounds: getCurrentBounds(state), size: 10 });
}

function createCode(state: ResizeDemoState): string {
  return `const handle = pickResizeHandle({ handles, x: pointerX, y: pointerY });

if (handle) {
  resizeState = startObjectResize({
    object: rect,
    handleName: handle.name,
    pointerX,
    pointerY,
    minWidth: 30,
    minHeight: 30
  });
}

updateObjectResize({ state: resizeState, pointerX, pointerY });

// rect: x ${state.rect.x}, y ${state.rect.y}
// size: ${state.rect.width} x ${state.rect.height}`;
}
