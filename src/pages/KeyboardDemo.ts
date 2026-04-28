import { BasicMaterial, Camera2D, Canvas, KeyboardController, Rect, Scene, SelectionManager } from "raw2d";
import type { KeyboardDemoRenderOptions } from "./KeyboardDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createKeyboardDemo(): HTMLElement {
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
  const rect = new Rect({ name: "card", x: 178, y: 86, width: 164, height: 96, material: new BasicMaterial({ fillColor: "#f45b69" }) });
  const selection = new SelectionManager({ objects: [rect] });
  let keyboard: KeyboardController;

  title.textContent = "Live Keyboard Controls";
  body.textContent = "Click this panel, then use Arrow keys, Shift+Arrow, Escape, or Delete.";
  canvasElement.className = "shape-demo-canvas";
  canvasElement.tabIndex = 0;
  canvasElement.addEventListener("pointerdown", () => canvasElement.focus());
  pre.append(code);
  scene.add(rect);
  keyboard = new KeyboardController({
    target: canvasElement,
    selection,
    scene,
    moveStep: 4,
    fastMoveStep: 20,
    onChange: () => renderDemo({ raw2dCanvas, scene, camera, selection, keyboard, rect, code })
  });
  keyboard.enableMove();
  keyboard.enableDelete();
  keyboard.enableClear();
  section.append(title, body, canvasElement, pre);
  renderDemo({ raw2dCanvas, scene, camera, selection, keyboard, rect, code });
  return section;
}

function renderDemo(options: KeyboardDemoRenderOptions): void {
  options.raw2dCanvas.render(options.scene, options.camera);
  drawOverlay(options.raw2dCanvas.getContext(), options);
  options.code.textContent = createCode(options);
}

function drawOverlay(context: CanvasRenderingContext2D, options: KeyboardDemoRenderOptions): void {
  context.save();
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`selected: ${options.selection.getSelected().length} | action: ${options.keyboard.getSnapshot().lastAction}`, 16, 24);

  if (options.selection.isSelected(options.rect)) {
    context.strokeStyle = "#facc15";
    context.lineWidth = 2;
    context.strokeRect(options.rect.x, options.rect.y, options.rect.width, options.rect.height);
  }

  context.restore();
}

function createCode(options: KeyboardDemoRenderOptions): string {
  return `const keyboard = new KeyboardController({
  target: canvasElement,
  selection,
  scene,
  moveStep: 4,
  fastMoveStep: 20,
  onChange: () => raw2dCanvas.render(scene, camera)
});

keyboard.enableMove();
keyboard.enableDelete();
keyboard.enableClear();

// rect: x ${options.rect.x}, y ${options.rect.y}
// selected: ${options.selection.getSelected().length}
// last action: ${options.keyboard.getSnapshot().lastAction}`;
}
