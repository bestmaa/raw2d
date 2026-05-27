import type { Raw2DBlurEffect, Raw2DGrayscaleEffect, Raw2DOpacityEffect, Raw2DShadowEffect } from "./Raw2DEffect.type.js";

export function createOpacityEffect(opacity: number, id?: string): Raw2DOpacityEffect {
  return { type: "opacity", opacity, ...(id ? { id } : {}) };
}

export function createBlurEffect(radius: number, id?: string): Raw2DBlurEffect {
  return { type: "blur", radius, ...(id ? { id } : {}) };
}

export function createGrayscaleEffect(amount: number, id?: string): Raw2DGrayscaleEffect {
  return { type: "grayscale", amount, ...(id ? { id } : {}) };
}

export function createShadowEffect(options: {
  readonly color: string;
  readonly blur?: number;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly id?: string;
}): Raw2DShadowEffect {
  return {
    type: "shadow",
    color: options.color,
    blur: options.blur ?? 0,
    offsetX: options.offsetX ?? 0,
    offsetY: options.offsetY ?? 0,
    ...(options.id ? { id: options.id } : {})
  };
}
