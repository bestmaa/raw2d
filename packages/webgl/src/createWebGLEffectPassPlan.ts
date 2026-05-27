import type { Raw2DEffect } from "raw2d-effects";
import type { CreateWebGLEffectPassPlanOptions, WebGLEffectPass, WebGLEffectPassPlan } from "./WebGLEffectPass.type.js";

export function createWebGLEffectPassPlan(options: CreateWebGLEffectPassPlanOptions): WebGLEffectPassPlan {
  const passes = options.effects.flatMap((effect, index) => createPass(effect, index));
  const inlinePasses = passes.filter((pass) => pass.boundary === "draw-batch");
  const shaderPasses = passes.filter((pass) => pass.boundary === "framebuffer");

  return {
    passes,
    inlinePasses,
    shaderPasses,
    requiresFramebuffer: shaderPasses.length > 0
  };
}

function createPass(effect: Raw2DEffect, index: number): readonly WebGLEffectPass[] {
  if (effect.enabled === false) {
    return [];
  }

  if (effect.type === "opacity") {
    return [createInlinePass(effect, index, "Opacity can be folded into batch alpha when WebGL effect execution is enabled.")];
  }

  if (effect.type === "grayscale") {
    return [createFramebufferPass(effect, index, "single-sample-fragment", "Grayscale needs a fragment pass over rendered pixels.")];
  }

  if (effect.type === "blur") {
    return [createFramebufferPass(effect, index, "multi-sample-fragment", "Blur needs neighboring pixel samples in a framebuffer pass.")];
  }

  return [createFramebufferPass(effect, index, "multi-sample-fragment", "Shadow needs expanded alpha sampling in a framebuffer pass.")];
}

function createInlinePass(effect: Raw2DEffect, index: number, reason: string): WebGLEffectPass {
  return {
    id: createPassId(effect, index),
    effect,
    effectType: effect.type,
    kind: "inline-alpha",
    boundary: "draw-batch",
    requiresFramebuffer: false,
    reason
  };
}

function createFramebufferPass(
  effect: Raw2DEffect,
  index: number,
  kind: WebGLEffectPass["kind"],
  reason: string
): WebGLEffectPass {
  return {
    id: createPassId(effect, index),
    effect,
    effectType: effect.type,
    kind,
    boundary: "framebuffer",
    requiresFramebuffer: true,
    reason
  };
}

function createPassId(effect: Raw2DEffect, index: number): string {
  return effect.id ?? `${effect.type}-${index}`;
}
