import { BasicMaterial, Camera2D, Canvas, Circle, Ellipse, Line, Polygon, Polyline, Rect, Scene, Sprite, Texture, WebGLRenderer2D } from "raw2d";
import type { WebGLRendererDemoRenderOptions, WebGLRendererDemoState, WebGLRendererScene } from "./WebGLRendererDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 180;

export function createWebGLRendererDemo(): HTMLElement {
  const state: WebGLRendererDemoState = { objectCount: 120 };
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
  body.textContent = "Both render the same scene. Canvas issues one draw per object. WebGL draws ordered shape batches and texture batches.";
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
    createRangeControl("Objects", 20, 500, state.objectCount, (value) => {
      state.objectCount = value;
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
  const { scene } = createScene(options.state.objectCount);
  options.canvasRenderer.render(scene, options.camera);
  options.canvasStats.textContent = formatCanvasStats(options.canvasRenderer);

  if (options.webglRenderer) {
    options.webglRenderer.render(scene, options.camera);
    options.webglStats.textContent = formatWebGLStats(options.webglRenderer);
  } else {
    options.webglStats.textContent = "WebGL2 unavailable in this browser.";
  }

  options.code.textContent = createCode(options.state.objectCount);
}

function createScene(objectCount: number): WebGLRendererScene {
  const scene = new Scene();
  const columns = 20;
  const spriteTexture = createSpriteTexture();

  for (let index = 0; index < objectCount; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    scene.add(createShape(index, column, row, spriteTexture));
  }

  return { scene };
}

function createShape(index: number, column: number, row: number, spriteTexture: Texture): Rect | Circle | Ellipse | Line | Polyline | Polygon | Sprite {
  const x = 14 + column * 24;
  const y = 16 + row * 18;
  const material = new BasicMaterial({ fillColor: createColor(index) });

  if (index % 7 === 1) {
    return new Circle({ x: x + 7, y: y + 5, radius: 7, material });
  }

  if (index % 7 === 2) {
    return new Ellipse({ x: x + 7, y: y + 5, radiusX: 8, radiusY: 5, material });
  }

  if (index % 7 === 3) {
    return new Line({ x, y: y + 5, endX: 15, endY: 0, material: new BasicMaterial({ strokeColor: createColor(index), lineWidth: 3 }) });
  }

  if (index % 7 === 4) {
    return new Polyline({
      x,
      y,
      points: [
        { x: 0, y: 10 },
        { x: 7, y: 0 },
        { x: 15, y: 10 }
      ],
      material: new BasicMaterial({ strokeColor: createColor(index), lineWidth: 3 })
    });
  }

  if (index % 7 === 5) {
    return new Polygon({
      x,
      y,
      points: [
        { x: 7, y: 0 },
        { x: 15, y: 10 },
        { x: 0, y: 10 }
      ],
      material
    });
  }

  if (index % 7 === 6) {
    return new Sprite({ texture: spriteTexture, x, y, width: 14, height: 10, opacity: 0.9 });
  }

  return new Rect({ x, y, width: 14, height: 10, material });
}

function createColor(index: number): string {
  const colors = ["#35c2ff", "#f45b69", "#facc15", "#4ade80"];
  return colors[Math.floor(index / 7) % colors.length] ?? "#35c2ff";
}

function createSpriteTexture(): Texture {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 16;
  canvas.height = 16;

  if (context) {
    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, 16, 16);
    context.fillStyle = "#0ea5e9";
    context.fillRect(2, 2, 12, 12);
    context.fillStyle = "#facc15";
    context.fillRect(5, 5, 6, 6);
  }

  return new Texture({ source: canvas, width: 16, height: 16 });
}

function formatCanvasStats(renderer: Canvas): string {
  const stats = renderer.getStats();
  return `objects: ${stats.objects} | drawCalls: ${stats.drawCalls}`;
}

function formatWebGLStats(renderer: WebGLRenderer2D): string {
  const stats = renderer.getStats();
  return `objects: ${stats.objects} | batches: ${stats.batches} | drawCalls: ${stats.drawCalls} | sprites: ${stats.sprites} | textures: ${stats.textures} | rects: ${stats.rects} | circles: ${stats.circles} | ellipses: ${stats.ellipses} | lines: ${stats.lines} | polylines: ${stats.polylines} | polygons: ${stats.polygons} | vertices: ${stats.vertices}`;
}

function createCode(objectCount: number): string {
  return `// Same scene: ${objectCount} Rect, Circle, Ellipse, Line, Polyline, Polygon, and Sprite objects
canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());`;
}
