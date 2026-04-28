import type { Canvas, WebGLRenderer2D } from "raw2d";
import type {
  WebGLPerformanceFrameTiming,
  WebGLPerformanceScene,
  WebGLPerformanceState
} from "./WebGLPerformanceDemo.type";

export function formatCanvasStats(renderer: Canvas, timing: WebGLPerformanceFrameTiming): string {
  const stats = renderer.getStats();
  return `${formatTiming(timing)} | objects: ${stats.objects} | drawCalls: ${stats.drawCalls}`;
}

export function formatWebGLStats(renderer: WebGLRenderer2D, timing: WebGLPerformanceFrameTiming): string {
  const stats = renderer.getStats();
  return `${formatTiming(timing)} | objects: ${stats.objects} | drawCalls: ${stats.drawCalls} | textureBinds: ${stats.textureBinds} | textureUploads: ${stats.textureUploads} | staticCacheHits: ${stats.staticCacheHits} | staticCacheMisses: ${stats.staticCacheMisses}`;
}

export function formatWebGLUnavailable(timing: WebGLPerformanceFrameTiming): string {
  return `${formatTiming(timing)} | WebGL2 unavailable.`;
}

export function formatWebGLPerformanceSummary(
  scene: WebGLPerformanceScene,
  state: WebGLPerformanceState
): string {
  const mode = state.running ? "running" : "paused";
  return `static: ${scene.staticCount} | dynamic: ${scene.dynamicCount} | textures: ${state.textureMode} | loop: ${mode}`;
}

export function createWebGLPerformanceCode(state: WebGLPerformanceState): string {
  return `const atlas = new TextureAtlasPacker({ padding: 2 }).pack(spriteSources);
tileSprite.setRenderMode("static");
movingObject.setRenderMode("dynamic");

const start = performance.now();
webglRenderer.render(scene, camera);
const frameMs = performance.now() - start;

console.log({
  frameMs,
  fps: 1000 / frameMs,
  stats: webglRenderer.getStats()
});

// objects: ${state.objectCount}
// texture mode: ${state.textureMode}`;
}

function formatTiming(timing: WebGLPerformanceFrameTiming): string {
  if (timing.frameMs === 0) {
    return "frameMs: -- | fps: --";
  }

  return `frameMs: ${timing.frameMs.toFixed(2)} | fps: ${timing.fps.toFixed(1)}`;
}
