import type { Raw2DEffect, Raw2DEffectType } from "raw2d-effects";

export type WebGLEffectPassKind = "inline-alpha" | "single-sample-fragment" | "multi-sample-fragment";

export type WebGLEffectPassBoundary = "draw-batch" | "framebuffer";

export interface WebGLEffectPass {
  readonly id: string;
  readonly effect: Raw2DEffect;
  readonly effectType: Raw2DEffectType;
  readonly kind: WebGLEffectPassKind;
  readonly boundary: WebGLEffectPassBoundary;
  readonly requiresFramebuffer: boolean;
  readonly reason: string;
}

export interface CreateWebGLEffectPassPlanOptions {
  readonly effects: readonly Raw2DEffect[];
}

export interface WebGLEffectPassPlan {
  readonly passes: readonly WebGLEffectPass[];
  readonly inlinePasses: readonly WebGLEffectPass[];
  readonly shaderPasses: readonly WebGLEffectPass[];
  readonly requiresFramebuffer: boolean;
}
