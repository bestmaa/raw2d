import { BasicMaterial, Camera2D, Canvas, Circle, InteractionController, Rect, Scene } from "raw2d";
import type { InteractionControllerDemoRenderOptions } from "./InteractionControllerDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createInteractionControllerDemo(): HTMLElement {
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
  const rect = createRect();
  let controller: InteractionController;

  title.textContent = "Live InteractionController";
  body.textContent = "Click to select, drag objects, and drag Rect handles to resize. The controller only mutates object state.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  scene.add(rect);
  scene.add(createCircle());
  controller = new InteractionController({
    canvas: canvasElement,
    scene,
    camera,
    width: demoCanvasWidth,
    height: demoCanvasHeight,
    minResizeWidth: 30,
    minResizeHeight: 30,
    onChange: () => renderDemo({ raw2dCanvas, scene, camera, controller, code, rect })
  });
  controller.enableSelection();
  controller.enableDrag();
  controller.enableResize();

  section.append(title, body, canvasElement, pre);
  renderDemo({ raw2dCanvas, scene, camera, controller, code, rect });
  return section;
}

function createRect(): Rect {
  return new Rect({
    name: "card",
    x: 96,
    y: 76,
    width: 172,
    height: 104,
    material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.74)" })
  });
}

function createCircle(): Circle {
  return new Circle({
    name: "badge",
    x: 360,
    y: 132,
    radius: 52,
    material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.74)" })
  });
}

function renderDemo(options: InteractionControllerDemoRenderOptions): void {
  options.raw2dCanvas.render(options.scene, options.camera);
  drawOverlay(options.raw2dCanvas.getContext(), options.controller);
  options.code.textContent = createCode(options);
}

function drawOverlay(context: CanvasRenderingContext2D, controller: InteractionController): void {
  const selected = controller.getSelection().getPrimary();
  const handles = controller.getResizeHandles();

  context.save();
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`mode: ${controller.getMode()} | selected: ${selected?.name || selected?.id || "none"}`, 16, 24);

  if (handles.length > 0) {
    context.strokeStyle = "#facc15";
    context.fillStyle = "#10141c";
    context.lineWidth = 2;

    for (const handle of handles) {
      context.fillRect(handle.x, handle.y, handle.width, handle.height);
      context.strokeRect(handle.x, handle.y, handle.width, handle.height);
    }
  }

  context.restore();
}

function createCode(options: InteractionControllerDemoRenderOptions): string {
  const selected = options.controller.getSelection().getPrimary();
  return `const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => raw2dCanvas.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();

// selected: ${selected?.name || selected?.id || "none"}
// rect: x ${options.rect.x}, y ${options.rect.y}
// size: ${options.rect.width} x ${options.rect.height}`;
}
