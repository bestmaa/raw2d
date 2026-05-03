import { BasicMaterial, Camera2D, Rect, Scene, WebGLRenderer2D } from "raw2d";
import type { WebGLBenchmarkRuntime } from "./WebGLBenchmarkPanel.type";

const width = 360;
const height = 220;

export function createWebGLBenchmarkPanel(): HTMLElement {
  const panel = document.createElement("article");
  const title = document.createElement("h2");
  const canvas = document.createElement("canvas");
  const stats = document.createElement("code");
  const scene = createScene();
  const camera = new Camera2D();
  const runtime: WebGLBenchmarkRuntime = { frameId: null, frame: 0, lastTime: performance.now(), fps: 0, connected: false };

  panel.className = "visual-test-card";
  title.textContent = "WebGL Benchmark";
  canvas.width = width;
  canvas.height = height;
  stats.className = "visual-test-results";
  panel.append(title, canvas, stats);

  try {
    const renderer = new WebGLRenderer2D({ canvas, width, height, backgroundColor: "#10141c" });
    renderFrame({ renderer, scene, camera, runtime, stats }, runtime.lastTime);
    scheduleFrame({ panel, renderer, scene, camera, runtime, stats });
  } catch (error) {
    stats.textContent = createUnavailableMessage(error);
  }

  return panel;
}

function createScene(): Scene {
  const scene = new Scene();
  const materialA = new BasicMaterial({ fillColor: "#35c2ff" });
  const materialB = new BasicMaterial({ fillColor: "#f45b69" });

  for (let index = 0; index < 140; index += 1) {
    scene.add(new Rect({
      x: 12 + (index % 20) * 17,
      y: 16 + Math.floor(index / 20) * 24,
      width: 11,
      height: 16,
      renderMode: index < 100 ? "static" : "dynamic",
      material: index % 2 === 0 ? materialA : materialB
    }));
  }

  return scene;
}

function scheduleFrame(options: {
  readonly panel: HTMLElement;
  readonly renderer: WebGLRenderer2D;
  readonly scene: Scene;
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
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly runtime: WebGLBenchmarkRuntime;
  readonly stats: HTMLElement;
}, time: number): void {
  options.runtime.frame += 1;
  options.camera.x = Math.sin(time / 900) * 20;
  options.renderer.render(options.scene, options.camera, { culling: true });
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
  options.stats.textContent = [
    "renderer: webgl2",
    `frame: ${options.runtime.frame}`,
    `fps: ${options.runtime.fps.toFixed(1)}`,
    `objects: ${stats.objects}`,
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
