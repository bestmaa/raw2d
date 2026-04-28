import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
import type { Object2D } from "raw2d";
import type { RenderPipelineDemoRenderOptions, RenderPipelineDemoState } from "./RenderPipelineDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createRenderPipelineDemo(): HTMLElement {
  const state: RenderPipelineDemoState = { cameraX: 0, culling: true };
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
  const objects = createObjects(scene);

  title.textContent = "Live Render Pipeline";
  body.textContent = "The pipeline builds a render list, then Canvas draws that list.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(title, body, canvasElement, createControls(state, raw2dCanvas, scene, camera, objects, code), pre);
  renderDemo({ raw2dCanvas, scene, camera, state, objects, code });
  return section;
}

function createObjects(scene: Scene): readonly Rect[] {
  const objects = [
    new Rect({ name: "back", x: 28, y: 80, width: 110, height: 90, zIndex: -2 }),
    new Rect({ name: "middle", x: 190, y: 80, width: 110, height: 90, zIndex: 0 }),
    new Rect({ name: "front", x: 352, y: 80, width: 110, height: 90, zIndex: 8 }),
    new Rect({ name: "outside", x: 720, y: 80, width: 110, height: 90, zIndex: 20 })
  ];

  for (const object of objects) {
    object.material = new BasicMaterial({ fillColor: "#35c2ff" });
    scene.add(object);
  }

  return objects;
}

function createControls(
  state: RenderPipelineDemoState,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  objects: readonly Rect[],
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Camera X", 0, 500, state.cameraX, (value) => {
      state.cameraX = value;
      renderDemo({ raw2dCanvas, scene, camera, state, objects, code });
    }),
    createToggleControl("Culling", state.culling, (checked) => {
      state.culling = checked;
      renderDemo({ raw2dCanvas, scene, camera, state, objects, code });
    })
  );
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Pipeline";
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

function createToggleControl(label: string, checked: boolean, onInput: (checked: boolean) => void): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "shape-demo-control";
  const input = document.createElement("input");
  const text = document.createElement("span");
  input.type = "checkbox";
  input.checked = checked;
  text.textContent = label;
  input.addEventListener("input", () => onInput(input.checked));
  wrapper.append(text, input);
  return wrapper;
}

function renderDemo(options: RenderPipelineDemoRenderOptions): void {
  options.camera.setPosition(options.state.cameraX, 0);
  const renderList = options.raw2dCanvas.createRenderList(options.scene, options.camera, { culling: options.state.culling });
  updateMaterials(options.objects, renderList.getObjects());
  options.raw2dCanvas.render(options.scene, options.camera, { renderList });
  drawOverlay(options.raw2dCanvas.getContext(), renderList);
  options.code.textContent = createCode(renderList.getObjects().map((object) => object.name), renderList.getStats().culled);
}

function updateMaterials(objects: readonly Rect[], visibleObjects: readonly Object2D[]): void {
  for (const object of objects) {
    const fillColor = visibleObjects.includes(object) ? "#35c2ff" : "rgba(100, 116, 139, 0.36)";
    object.material = new BasicMaterial({ fillColor });
  }
}

function drawOverlay(context: CanvasRenderingContext2D, renderList: ReturnType<Canvas["createRenderList"]>): void {
  const stats = renderList.getStats();
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`items: ${stats.accepted} | culled: ${stats.culled}`, 16, 24);
  context.restore();
}

function createCode(names: readonly string[], culled: number): string {
  return `const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

raw2dCanvas.render(scene, camera, { renderList });

// draw order: ${names.join(", ")}
// culled: ${culled}`;
}
