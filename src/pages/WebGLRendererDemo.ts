import { BasicMaterial, Camera2D, Canvas, Rect, Scene, WebGLRenderer2D } from "raw2d";
import type { WebGLRendererDemoRenderOptions, WebGLRendererDemoState, WebGLRendererScene } from "./WebGLRendererDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 180;

export function createWebGLRendererDemo(): HTMLElement {
  const state: WebGLRendererDemoState = { rectCount: 120 };
  const section = document.createElement("article");
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const canvasElement = document.createElement("canvas");
  const webglElement = document.createElement("canvas");
  const canvasStats = document.createElement("code");
  const webglStats = document.createElement("code");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const canvasRenderer = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const webglRenderer = createWebGLRenderer(webglElement);
  const camera = new Camera2D();

  section.className = "doc-section shape-demo";
  title.textContent = "Live Canvas vs WebGL";
  body.textContent = "Both render the same Rect scene. Canvas issues one shape draw per rect. WebGL writes all rects to one buffer and draws once.";
  canvasElement.className = "shape-demo-canvas";
  webglElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(
    title,
    body,
    createRendererBlock("Canvas", canvasElement, canvasStats),
    createRendererBlock("WebGL2", webglElement, webglStats),
    createControls(state, canvasRenderer, webglRenderer, camera, canvasStats, webglStats, code),
    pre
  );
  renderDemo({ canvasRenderer, webglRenderer, camera, state, canvasStats, webglStats, code });
  return section;
}

function createWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer2D | null {
  try {
    return new WebGLRenderer2D({
      canvas,
      width: demoCanvasWidth,
      height: demoCanvasHeight,
      backgroundColor: "#10141c"
    });
  } catch {
    return null;
  }
}

function createRendererBlock(label: string, canvas: HTMLCanvasElement, stats: HTMLElement): HTMLElement {
  const block = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = label;
  stats.className = "shape-demo-loading";
  block.append(title, canvas, stats);
  return block;
}

function createControls(
  state: WebGLRendererDemoState,
  canvasRenderer: Canvas,
  webglRenderer: WebGLRenderer2D | null,
  camera: Camera2D,
  canvasStats: HTMLElement,
  webglStats: HTMLElement,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createControlsTitle());
  controls.append(
    createRangeControl("Rects", 20, 500, state.rectCount, (value) => {
      state.rectCount = value;
      renderDemo({ canvasRenderer, webglRenderer, camera, state, canvasStats, webglStats, code });
    })
  );
  return controls;
}

function createControlsTitle(): HTMLElement {
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Scene";
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
  input.step = "20";
  input.value = String(value);
  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    text.textContent = `${label}: ${nextValue}`;
    onInput(nextValue);
  });
  wrapper.append(text, input);
  return wrapper;
}

function renderDemo(options: WebGLRendererDemoRenderOptions): void {
  const { scene } = createScene(options.state.rectCount);
  options.canvasRenderer.render(scene, options.camera);
  options.canvasStats.textContent = formatCanvasStats(options.canvasRenderer);

  if (options.webglRenderer) {
    options.webglRenderer.render(scene, options.camera);
    options.webglStats.textContent = formatWebGLStats(options.webglRenderer);
  } else {
    options.webglStats.textContent = "WebGL2 unavailable in this browser.";
  }

  options.code.textContent = createCode(options.state.rectCount);
}

function createScene(rectCount: number): WebGLRendererScene {
  const scene = new Scene();
  const columns = 20;

  for (let index = 0; index < rectCount; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    scene.add(
      new Rect({
        x: 14 + column * 24,
        y: 16 + row * 18,
        width: 14,
        height: 10,
        material: new BasicMaterial({ fillColor: createColor(index) })
      })
    );
  }

  return { scene };
}

function createColor(index: number): string {
  const colors = ["#35c2ff", "#f45b69", "#facc15", "#4ade80"];
  return colors[index % colors.length] ?? "#35c2ff";
}

function formatCanvasStats(renderer: Canvas): string {
  const stats = renderer.getStats();
  return `objects: ${stats.objects} | drawCalls: ${stats.drawCalls}`;
}

function formatWebGLStats(renderer: WebGLRenderer2D): string {
  const stats = renderer.getStats();
  return `objects: ${stats.objects} | rects: ${stats.rects} | vertices: ${stats.vertices} | drawCalls: ${stats.drawCalls}`;
}

function createCode(rectCount: number): string {
  return `// Same scene: ${rectCount} Rect objects
canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());`;
}

