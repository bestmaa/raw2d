import { Camera2D, Canvas, WebGLRenderer2D } from "raw2d";
import { createWebGLPerformanceAssets } from "./WebGLPerformanceAssets";
import { createWebGLPerformanceControls } from "./WebGLPerformanceControls";
import { createWebGLPerformanceScene } from "./WebGLPerformanceScene";
import { createFrameTimer } from "./WebGLPerformanceTiming";
import {
  createWebGLPerformanceCode,
  formatCanvasStats,
  formatWebGLPerformanceSummary,
  formatWebGLSpriteDiagnostics,
  formatWebGLStats,
  formatWebGLUnavailable
} from "./WebGLPerformanceText";
import type {
  WebGLPerformanceRenderOptions,
  WebGLPerformanceRuntime,
  WebGLPerformanceState
} from "./WebGLPerformanceDemo.type";

const width = 520;
const height = 260;

export function createWebGLPerformanceDemo(): HTMLElement {
  const state: WebGLPerformanceState = {
    objectCount: 420,
    textureMode: "packed",
    running: true,
    culling: true,
    staticMode: true
  };
  const runtime = createRuntime();
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const webglElement = document.createElement("canvas");
  const canvasStats = document.createElement("code");
  const webglStats = document.createElement("code");
  const spriteStats = document.createElement("code");
  const summary = document.createElement("code");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const canvasRenderer = new Canvas({ canvas: canvasElement, width, height, backgroundColor: "#10141c" });
  const webglRenderer = createWebGLRenderer(webglElement);
  const camera = new Camera2D();
  const assets = createWebGLPerformanceAssets();
  const options: WebGLPerformanceRenderOptions = {
    canvasRenderer,
    webglRenderer,
    camera,
    assets,
    state,
    runtime,
    canvasStats,
    webglStats,
    spriteStats,
    summary,
    code
  };

  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  webglElement.className = "shape-demo-canvas";
  pre.append(code);
  section.append(
    createTitle(),
    createRendererBlock("Canvas", canvasElement, canvasStats),
    createRendererBlock("WebGL2", webglElement, webglStats),
    createInfoBlock("Sprite Diagnostics", spriteStats),
    createSummary(summary),
    createWebGLPerformanceControls(
      state,
      () => handleInputChange(options),
      () => handleLoopToggle(options, section)
    ),
    pre
  );

  renderDemo(options);
  scheduleFrame(options, section);
  return section;
}

function createRuntime(): WebGLPerformanceRuntime {
  return {
    frameId: null,
    timeSeconds: 0,
    canvasTimer: createFrameTimer(),
    webglTimer: createFrameTimer()
  };
}

function createTitle(): HTMLElement {
  const wrapper = document.createElement("div");
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live WebGL Performance";
  body.textContent = "Compare Canvas and WebGL frame timing. WebGL warms the static cache first, then times the cached render pass.";
  wrapper.append(title, body);
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
  return createInfoBlock("Result", summary);
}

function createInfoBlock(label: string, content: HTMLElement): HTMLElement {
  const block = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = label;
  content.className = "shape-demo-loading";
  block.append(title, content);
  return block;
}

function handleInputChange(options: WebGLPerformanceRenderOptions): void {
  options.runtime.canvasTimer.reset();
  options.runtime.webglTimer.reset();
  renderDemo(options);
}

function handleLoopToggle(options: WebGLPerformanceRenderOptions, host: HTMLElement): void {
  if (options.state.running) {
    scheduleFrame(options, host);
    return;
  }

  cancelFrame(options.runtime);
  renderDemo(options);
}

function scheduleFrame(options: WebGLPerformanceRenderOptions, host: HTMLElement): void {
  if (!options.state.running || options.runtime.frameId !== null) {
    return;
  }

  options.runtime.frameId = requestAnimationFrame((timeMs: number) => {
    options.runtime.frameId = null;

    if (!host.isConnected) {
      options.state.running = false;
      return;
    }

    options.runtime.timeSeconds = timeMs / 1000;
    renderDemo(options);
    scheduleFrame(options, host);
  });
}

function cancelFrame(runtime: WebGLPerformanceRuntime): void {
  if (runtime.frameId === null) {
    return;
  }

  cancelAnimationFrame(runtime.frameId);
  runtime.frameId = null;
}

function renderDemo(options: WebGLPerformanceRenderOptions): void {
  const prepared = createWebGLPerformanceScene(options.state, options.assets, options.runtime.timeSeconds);
  const canvasStart = performance.now();
  options.canvasRenderer.render(prepared.scene, options.camera, { culling: options.state.culling });
  const canvasTiming = options.runtime.canvasTimer.record(performance.now() - canvasStart);
  options.canvasStats.textContent = formatCanvasStats(options.canvasRenderer, canvasTiming);

  if (!options.webglRenderer) {
    options.webglStats.textContent = formatWebGLUnavailable(options.runtime.webglTimer.getSnapshot());
    options.spriteStats.textContent = "WebGL2 unavailable.";
    options.summary.textContent = formatWebGLPerformanceSummary(prepared, options.state);
    options.code.textContent = createWebGLPerformanceCode(options.state);
    return;
  }

  options.webglRenderer.render(prepared.scene, options.camera, { culling: options.state.culling });
  const webglStart = performance.now();
  options.webglRenderer.render(prepared.scene, options.camera, { culling: options.state.culling });
  const webglTiming = options.runtime.webglTimer.record(performance.now() - webglStart);
  options.webglStats.textContent = formatWebGLStats(options.webglRenderer, webglTiming);
  options.spriteStats.textContent = formatWebGLSpriteDiagnostics(options.webglRenderer);
  options.summary.textContent = formatWebGLPerformanceSummary(prepared, options.state);
  options.code.textContent = createWebGLPerformanceCode(options.state);
}
