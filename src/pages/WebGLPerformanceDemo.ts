import { Camera2D, Canvas, WebGLRenderer2D } from "raw2d";
import { createWebGLPerformanceAssets } from "./WebGLPerformanceAssets";
import { createWebGLPerformanceScene } from "./WebGLPerformanceScene";
import { createFrameTimer } from "./WebGLPerformanceTiming";
import {
  createWebGLPerformanceCode,
  formatCanvasStats,
  formatWebGLPerformanceSummary,
  formatWebGLStats,
  formatWebGLUnavailable
} from "./WebGLPerformanceText";
import type {
  WebGLPerformanceRenderOptions,
  WebGLPerformanceRuntime,
  WebGLPerformanceState,
  WebGLPerformanceTextureMode
} from "./WebGLPerformanceDemo.type";

const width = 520;
const height = 260;

export function createWebGLPerformanceDemo(): HTMLElement {
  const state: WebGLPerformanceState = { objectCount: 420, textureMode: "packed", running: true };
  const runtime = createRuntime();
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
  const options: WebGLPerformanceRenderOptions = {
    canvasRenderer,
    webglRenderer,
    camera,
    assets,
    state,
    runtime,
    canvasStats,
    webglStats,
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
    createSummary(summary),
    createControls(
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
  const block = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "shape-demo-controls-title";
  title.textContent = "Result";
  summary.className = "shape-demo-loading";
  block.append(title, summary);
  return block;
}

function createControls(state: WebGLPerformanceState, onChange: () => void, onToggle: () => void): HTMLElement {
  const controls = document.createElement("div");
  const runButton = document.createElement("button");
  controls.className = "shape-demo-controls";
  runButton.type = "button";
  runButton.className = "shape-demo-action";
  runButton.textContent = "Pause loop";
  runButton.addEventListener("click", () => {
    state.running = !state.running;
    runButton.textContent = state.running ? "Pause loop" : "Play loop";
    onToggle();
  });
  controls.append(runButton, createRangeControl(state, onChange), createModeControl(state, onChange));
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
  options.canvasRenderer.render(prepared.scene, options.camera);
  const canvasTiming = options.runtime.canvasTimer.record(performance.now() - canvasStart);
  options.canvasStats.textContent = formatCanvasStats(options.canvasRenderer, canvasTiming);

  if (!options.webglRenderer) {
    options.webglStats.textContent = formatWebGLUnavailable(options.runtime.webglTimer.getSnapshot());
    options.summary.textContent = formatWebGLPerformanceSummary(prepared, options.state);
    options.code.textContent = createWebGLPerformanceCode(options.state);
    return;
  }

  options.webglRenderer.render(prepared.scene, options.camera);
  const webglStart = performance.now();
  options.webglRenderer.render(prepared.scene, options.camera);
  const webglTiming = options.runtime.webglTimer.record(performance.now() - webglStart);
  options.webglStats.textContent = formatWebGLStats(options.webglRenderer, webglTiming);
  options.summary.textContent = formatWebGLPerformanceSummary(prepared, options.state);
  options.code.textContent = createWebGLPerformanceCode(options.state);
}
