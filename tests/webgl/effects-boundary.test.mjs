import assert from "node:assert/strict";
import test from "node:test";
import { createBlurEffect, createGrayscaleEffect, createOpacityEffect, createShadowEffect } from "raw2d-effects";
import { createWebGLEffectPassPlan } from "raw2d-webgl";

test("createWebGLEffectPassPlan separates inline and framebuffer effect boundaries", () => {
  const plan = createWebGLEffectPassPlan({
    effects: [
      createOpacityEffect(0.75, "fade"),
      createGrayscaleEffect(0.4, "tone"),
      createBlurEffect(3, "soften"),
      createShadowEffect({ id: "shadow", color: "rgba(0,0,0,0.4)", blur: 8, offsetX: 2, offsetY: 3 })
    ]
  });

  assert.equal(plan.requiresFramebuffer, true);
  assert.deepEqual(plan.inlinePasses.map((pass) => pass.id), ["fade"]);
  assert.deepEqual(plan.shaderPasses.map((pass) => pass.id), ["tone", "soften", "shadow"]);
  assert.deepEqual(plan.passes.map((pass) => pass.kind), [
    "inline-alpha",
    "single-sample-fragment",
    "multi-sample-fragment",
    "multi-sample-fragment"
  ]);
});

test("createWebGLEffectPassPlan skips disabled effects", () => {
  const plan = createWebGLEffectPassPlan({
    effects: [{ ...createBlurEffect(4, "disabled-blur"), enabled: false }]
  });

  assert.deepEqual(plan.passes, []);
  assert.equal(plan.requiresFramebuffer, false);
});
