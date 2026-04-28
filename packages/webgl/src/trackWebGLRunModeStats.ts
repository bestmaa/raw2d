import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";

export function trackWebGLRunModeStats(
  run: WebGLRenderRun,
  batches: number,
  stats: MutableWebGLRenderStats
): void {
  stats.batches += batches;

  if (run.mode === "static") {
    stats.staticBatches += batches;
    stats.staticObjects += run.items.length;
  } else {
    stats.dynamicBatches += batches;
    stats.dynamicObjects += run.items.length;
  }
}
