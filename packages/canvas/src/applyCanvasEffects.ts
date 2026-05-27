import type { ApplyCanvasEffectsOptions } from "./CanvasEffects.type.js";

export function applyCanvasEffects(options: ApplyCanvasEffectsOptions): void {
  const filters: string[] = [];

  for (const effect of options.effects) {
    if (effect.enabled === false) continue;

    if (effect.type === "opacity") {
      options.context.globalAlpha *= effect.opacity;
    } else if (effect.type === "blur") {
      filters.push(`blur(${effect.radius}px)`);
    } else if (effect.type === "grayscale") {
      filters.push(`grayscale(${effect.amount})`);
    } else {
      options.context.shadowColor = effect.color;
      options.context.shadowBlur = effect.blur;
      options.context.shadowOffsetX = effect.offsetX;
      options.context.shadowOffsetY = effect.offsetY;
    }
  }

  if (filters.length > 0) {
    options.context.filter = filters.join(" ");
  }
}
