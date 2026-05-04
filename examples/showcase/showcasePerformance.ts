import type { ApplyShowcasePerformanceOptions } from "./ShowcasePerformance.type";

export function applyShowcasePerformance(options: ApplyShowcasePerformanceOptions): void {
  const renderMode = options.options.staticBatches ? "static" : "dynamic";

  for (const sprite of options.scene.staticSprites) {
    sprite.setRenderMode(renderMode);
  }
}
