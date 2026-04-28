import { Camera2D, Canvas, WebGLRenderer2D } from "raw2d";
import { createWebGLPerformanceAssets } from "./WebGLPerformanceAssets";
import { createWebGLPerformanceScene } from "./WebGLPerformanceScene";
import type {
  WebGLPerformanceRenderOptions,
  WebGLPerformanceState,
  WebGLPerformanceTextureMode
} from "./WebGLPerformanceDemo.type";

const width = 520;
const height = 260;

export function createWebGLPerformanceDemo(): HTMLElement {
  const state: WebGLPerformanceState = { objectCount: 420, textureMode: "packed" };
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const webglElement = document.createElement("canvas");
  const canvasStats = document.createElement("code");
  const webglStats = document.createElement("code");
  const summary = document.createElement("code");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const canvasRenderer = new Canvas({ canvas: canvasElement, width, height, backgroundColor: "#10141c" });
  const webglRenderer = createWebGLRenderer(webglElement);
  const camera = new Camera2D();
  const assets = createWebGLPerformanceAssets();

  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  webglElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(
    createTitle(),
    createRendererBlock("Canvas", canvasElement, canvasStats),
    createRendererBlock("WebGL2", webglElement, webglStats),
    createSummary(summary),
    createControls(state, () => renderDemo({ canvasRenderer, webglRenderer, camera, assets, state, canvasStats, webglStats, summary, code })),
    pre
  );
  renderDemo({ canvasRenderer, webglRenderer, camera, assets, state, canvasStats, webglStats, summary, code });
  return section;
}

function createTitle(): HTMLElement {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live WebGL Performance";
  body.textContent = "Static atlas sprites are rendered twice so the second WebGL frame shows cache hits. Switch texture mode to see texture bind changes.";
  fragment.append(title, body);
  const wrapper = document.createElement("div");
  wrapper.append(fragment);
  return wrapper;
}

function createWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer2D | null {
  try {
    return new WebGLRenderer2D({ canvas, width, height, backgroundColor: "#10141c" });
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

function createSummary(summary: HTMLElement): HTMLElement {
  const block = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Result";
  summary.className = "shape-demo-loading";
  block.append(title, summary);
  return block;
}

function createControls(state: WebGLPerformanceState, onChange: () => void): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "shape-demo-controls";
  controls.append(createRangeControl(state, onChange), createModeControl(state, onChange));
  return controls;
}

function createRangeControl(state: WebGLPerformanceState, onChange: () => void): HTMLElement {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  wrapper.className = "shape-demo-control";
  text.textContent = `Objects: ${state.objectCount}`;
  input.type = "range";
  input.min = "100";
  input.max = "1000";
  input.step = "20";
  input.value = String(state.objectCount);
  input.addEventListener("input", () => {
    state.objectCount = Number(input.value);
    text.textContent = `Objects: ${state.objectCount}`;
    onChange();
  });
  wrapper.append(text, input);
  return wrapper;
}

function createModeControl(state: WebGLPerformanceState, onChange: () => void): HTMLElement {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const select = document.createElement("select");
  wrapper.className = "shape-demo-control";
  text.textContent = "Textures";
  select.append(createOption("packed", "Packed atlas"), createOption("separate", "Separate"));
  select.value = state.textureMode;
  select.addEventListener("change", () => {
    state.textureMode = select.value as WebGLPerformanceTextureMode;
    onChange();
  });
  wrapper.append(text, select);
  return wrapper;
}

function createOption(value: WebGLPerformanceTextureMode, label: string): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function renderDemo(options: WebGLPerformanceRenderOptions): void {
  const prepared = createWebGLPerformanceScene(options.state, options.assets);
  options.canvasRenderer.render(prepared.scene, options.camera);
  options.canvasStats.textContent = `objects: ${options.canvasRenderer.getStats().objects} | drawCalls: ${options.canvasRenderer.getStats().drawCalls}`;

  if (!options.webglRenderer) {
    options.webglStats.textContent = "WebGL2 unavailable.";
    return;
  }

  options.webglRenderer.render(prepared.scene, options.camera);
  options.webglRenderer.render(prepared.scene, options.camera);
  options.webglStats.textContent = formatWebGLStats(options.webglRenderer);
  options.summary.textContent = `static: ${prepared.staticCount} | dynamic: ${prepared.dynamicCount} | mode: ${options.state.textureMode}`;
  options.code.textContent = createCode(options.state);
}

function formatWebGLStats(renderer: WebGLRenderer2D): string {
  const stats = renderer.getStats();
  return `objects: ${stats.objects} | drawCalls: ${stats.drawCalls} | textureBinds: ${stats.textureBinds} | textureUploads: ${stats.textureUploads} | staticCacheHits: ${stats.staticCacheHits} | staticCacheMisses: ${stats.staticCacheMisses}`;
}

function createCode(state: WebGLPerformanceState): string {
  return `const atlas = new TextureAtlasPacker({ padding: 2 }).pack(spriteSources);
tileSprite.setRenderMode("static");
movingObject.setRenderMode("dynamic");

webglRenderer.render(scene, camera); // upload and cache miss
webglRenderer.render(scene, camera); // cache hit

console.log(webglRenderer.getStats());
// objects: ${state.objectCount}
// texture mode: ${state.textureMode}`;
}
