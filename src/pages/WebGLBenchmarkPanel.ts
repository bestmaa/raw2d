import { Camera2D, Scene, WebGLRenderer2D } from "raw2d";
import { createBenchmarkScene } from "./createBenchmarkScene";
import type { BenchmarkPanelController, BenchmarkSceneOptions } from "./BenchmarkScene.type";
import type { WebGLBenchmarkRuntime } from "./WebGLBenchmarkPanel.type";

const width = 360;
const height = 220;

export function createWebGLBenchmarkPanel(initialOptions: BenchmarkSceneOptions): BenchmarkPanelController {
  const panel = document.createElement("article");
  const title = document.createElement("h2");
  const canvas = document.createElement("canvas");
  const stats = document.createElement("code");
  let sceneOptions = { ...initialOptions };
  let scene = createBenchmarkScene(initialOptions);
  const camera = new Camera2D();
  const runtime: WebGLBenchmarkRuntime = { frameId: null, frame: 0, lastTime: performance.now(), fps: 0, frameMs: 0, connected: false };
  let renderer: WebGLRenderer2D | null = null;

  panel.className = "visual-test-card";
  title.textContent = "WebGL Benchmark";
  canvas.width = width;
  canvas.height = height;
  stats.className = "visual-test-results";
  panel.append(title, canvas, stats);

  try {
    renderer = new WebGLRenderer2D({ canvas, width, height, backgroundColor: "#10141c" });
    renderFrame({ renderer, getScene: () => scene, getOptions: () => sceneOptions, camera, runtime, stats }, runtime.lastTime);
    scheduleFrame({ panel, renderer, getScene: () => scene, getOptions: () => sceneOptions, camera, runtime, stats });
  } catch (error) {
    stats.textContent = createUnavailableMessage(error);
  }

  return {
    element: panel,
    updateScene(options: BenchmarkSceneOptions): void {
      sceneOptions = { ...options };
      scene = createBenchmarkScene(options);

      if (renderer) {
        renderFrame({ renderer, getScene: () => scene, getOptions: () => sceneOptions, camera, runtime, stats }, performance.now());
      }
    }
  }
}

function scheduleFrame(options: {
  readonly panel: HTMLElement;
  readonly renderer: WebGLRenderer2D;
  readonly getScene: () => Scene;
  readonly getOptions: () => BenchmarkSceneOptions;
  readonly camera: Camera2D;
  readonly runtime: WebGLBenchmarkRuntime;
  readonly stats: HTMLElement;
}): void {
  options.runtime.frameId = window.setTimeout(() => {
    const time = performance.now();

    options.runtime.connected = options.runtime.connected || options.panel.isConnected;
    renderFrame(options, time);
    scheduleFrame(options);
  }, 100);
}

function renderFrame(options: {
  readonly renderer: WebGLRenderer2D;
  readonly getScene: () => Scene;
  readonly getOptions: () => BenchmarkSceneOptions;
  readonly camera: Camera2D;
  readonly runtime: WebGLBenchmarkRuntime;
  readonly stats: HTMLElement;
}, time: number): void {
  options.runtime.frame += 1;
  options.camera.x = Math.sin(time / 900) * 20;
  options.renderer.render(options.getScene(), options.camera, { culling: options.getOptions().cullingEnabled });
  updateStats(options, time);
}

function updateStats(options: {
  readonly renderer: WebGLRenderer2D;
  readonly runtime: WebGLBenchmarkRuntime;
  readonly stats: HTMLElement;
}, time: number): void {
  const delta = Math.max(1, time - options.runtime.lastTime);
  const stats = options.renderer.getStats();

  options.runtime.lastTime = time;
  options.runtime.fps = 1000 / delta;
  options.runtime.frameMs = delta;
  options.stats.textContent = [
    "renderer: webgl2",
    `frame: ${options.runtime.frame}`,
    `fps: ${options.runtime.fps.toFixed(1)}`,
    `frameMs: ${options.runtime.frameMs.toFixed(2)}`,
    `objects: ${stats.objects}`,
    `rects: ${stats.rects}`,
    `circles: ${stats.circles}`,
    `lines: ${stats.lines}`,
    `drawCalls: ${stats.drawCalls}`,
    `batches: ${stats.batches}`,
    `staticBatches: ${stats.staticBatches}`,
    `dynamicBatches: ${stats.dynamicBatches}`,
    `textureBinds: ${stats.textureBinds}`,
    `bufferData: ${stats.uploadBufferDataCalls}`
  ].join("\n");
}

function createUnavailableMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "WebGL2 context is not available.";

  return [
    "renderer: webgl2 unavailable",
    message,
    "Canvas benchmark still works on this browser."
  ].join("\n");
}
