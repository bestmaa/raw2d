import { Camera2D, Canvas, Scene } from "raw2d";
import { createBenchmarkScene } from "./createBenchmarkScene";
import type { BenchmarkPanelController, BenchmarkSceneOptions } from "./BenchmarkScene.type";
import type { CanvasBenchmarkRuntime } from "./CanvasBenchmarkPanel.type";

const width = 360;
const height = 220;

export function createCanvasBenchmarkPanel(initialOptions: BenchmarkSceneOptions): BenchmarkPanelController {
  const panel = document.createElement("article");
  const title = document.createElement("h2");
  const canvas = document.createElement("canvas");
  const stats = document.createElement("code");
  const renderer = new Canvas({ canvas, width, height, backgroundColor: "#10141c" });
  let scene = createBenchmarkScene(initialOptions);
  const camera = new Camera2D();
  const runtime: CanvasBenchmarkRuntime = { frameId: null, frame: 0, lastTime: performance.now(), fps: 0, frameMs: 0, connected: false };

  panel.className = "visual-test-card";
  title.textContent = "Canvas Benchmark";
  canvas.width = width;
  canvas.height = height;
  stats.className = "visual-test-results";
  panel.append(title, canvas, stats);
  renderFrame({ renderer, getScene: () => scene, camera, runtime, stats }, runtime.lastTime);
  scheduleFrame({ panel, renderer, getScene: () => scene, camera, runtime, stats });
  return {
    element: panel,
    updateScene(options: BenchmarkSceneOptions): void {
      scene = createBenchmarkScene(options);
      renderFrame({ renderer, getScene: () => scene, camera, runtime, stats }, performance.now());
    }
  }
}

function scheduleFrame(options: {
  readonly panel: HTMLElement;
  readonly renderer: Canvas;
  readonly getScene: () => Scene;
  readonly camera: Camera2D;
  readonly runtime: CanvasBenchmarkRuntime;
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
  readonly renderer: Canvas;
  readonly getScene: () => Scene;
  readonly camera: Camera2D;
  readonly runtime: CanvasBenchmarkRuntime;
  readonly stats: HTMLElement;
}, time: number): void {
  options.runtime.frame += 1;
  options.camera.x = Math.sin(time / 900) * 20;
  options.renderer.render(options.getScene(), options.camera);
  updateStats(options, time);
}

function updateStats(options: {
  readonly renderer: Canvas;
  readonly runtime: CanvasBenchmarkRuntime;
  readonly stats: HTMLElement;
}, time: number): void {
  const delta = Math.max(1, time - options.runtime.lastTime);
  const stats = options.renderer.getStats();

  options.runtime.lastTime = time;
  options.runtime.fps = 1000 / delta;
  options.runtime.frameMs = delta;
  options.stats.textContent = [
    `renderer: canvas`,
    `frame: ${options.runtime.frame}`,
    `fps: ${options.runtime.fps.toFixed(1)}`,
    `frameMs: ${options.runtime.frameMs.toFixed(2)}`,
    `objects: ${stats.objects}`,
    `drawCalls: ${stats.drawCalls}`,
    "textureBinds: n/a",
    `culled: ${stats.renderList.culled}`
  ].join("\n");
}
