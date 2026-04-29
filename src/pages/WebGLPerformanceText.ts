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
  return `${formatTiming(timing)} | objects: ${stats.objects}/${stats.renderList.total} | culled: ${stats.renderList.culled} | drawCalls: ${stats.drawCalls} | batches: ${stats.batches} | textureBinds: ${stats.textureBinds} | staticCacheHits: ${stats.staticCacheHits} | uploadedBytes: ${stats.uploadedBytes}`;
}

export function formatWebGLSpriteDiagnostics(renderer: WebGLRenderer2D): string {
  const stats = renderer.getStats();
  return [
    `spriteBatches: ${stats.spriteBatches}`,
    `staticSprites: ${stats.staticSprites}`,
    `dynamicSprites: ${stats.dynamicSprites}`,
    `spriteTextureGroups: ${stats.spriteTextureGroups}`,
    `spriteTextureBinds: ${stats.spriteTextureBinds}`,
    `sortedSpriteTextureBinds: ${stats.sortedSpriteTextureBinds}`,
    `spriteTextureBindReduction: ${stats.spriteTextureBindReduction}`,
    `skippedSpriteTextures: ${stats.skippedSpriteTextures}`
  ].join("\n");
}

export function formatWebGLUnavailable(timing: WebGLPerformanceFrameTiming): string {
  return `${formatTiming(timing)} | WebGL2 unavailable.`;
}

export function formatWebGLPerformanceSummary(
  scene: WebGLPerformanceScene,
  state: WebGLPerformanceState
): string {
  const mode = state.running ? "running" : "paused";
  const culling = state.culling ? "on" : "off";
  const cache = state.staticMode ? "on" : "off";
  const staticCount = state.staticMode ? scene.staticCount : 0;
  const dynamicCount = state.staticMode ? scene.dynamicCount : scene.staticCount + scene.dynamicCount;
  return `static: ${staticCount} | dynamic: ${dynamicCount} | textures: ${state.textureMode} | culling: ${culling} | static cache: ${cache} | loop: ${mode}`;
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
// texture mode: ${state.textureMode}
// culling: ${state.culling ? "on" : "off"}
// static cache: ${state.staticMode ? "on" : "off"}`;
}

function formatTiming(timing: WebGLPerformanceFrameTiming): string {
  if (timing.frameMs === 0) {
    return "frameMs: -- | fps: --";
  }

  return `frameMs: ${timing.frameMs.toFixed(2)} | fps: ${timing.fps.toFixed(1)}`;
}
