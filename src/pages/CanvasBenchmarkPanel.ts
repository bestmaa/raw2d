import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
import type { CanvasBenchmarkRuntime } from "./CanvasBenchmarkPanel.type";

const width = 360;
const height = 220;

export function createCanvasBenchmarkPanel(): HTMLElement {
  const panel = document.createElement("article");
  const title = document.createElement("h2");
  const canvas = document.createElement("canvas");
  const stats = document.createElement("code");
  const renderer = new Canvas({ canvas, width, height, backgroundColor: "#10141c" });
  const scene = createScene();
  const camera = new Camera2D();
  const runtime: CanvasBenchmarkRuntime = { frameId: null, frame: 0, lastTime: performance.now(), fps: 0, connected: false };

  panel.className = "visual-test-card";
  title.textContent = "Canvas Benchmark";
  canvas.width = width;
  canvas.height = height;
  stats.className = "visual-test-results";
  panel.append(title, canvas, stats);
  renderFrame({ renderer, scene, camera, runtime, stats }, runtime.lastTime);
  scheduleFrame({ panel, renderer, scene, camera, runtime, stats });
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
      material: index % 2 === 0 ? materialA : materialB
    }));
  }

  return scene;
}

function scheduleFrame(options: {
  readonly panel: HTMLElement;
  readonly renderer: Canvas;
  readonly scene: Scene;
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
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly runtime: CanvasBenchmarkRuntime;
  readonly stats: HTMLElement;
}, time: number): void {
  options.runtime.frame += 1;
  options.camera.x = Math.sin(time / 900) * 20;
  options.renderer.render(options.scene, options.camera, { culling: true });
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
  options.stats.textContent = [
    `renderer: canvas`,
    `frame: ${options.runtime.frame}`,
    `fps: ${options.runtime.fps.toFixed(1)}`,
    `objects: ${stats.objects}`,
    `drawCalls: ${stats.drawCalls}`,
    `culled: ${stats.renderList.culled}`
  ].join("\n");
}
