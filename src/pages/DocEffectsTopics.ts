import type { DocTopic } from "./DocPage.type";

export const effectsTopics: readonly DocTopic[] = [
  {
    id: "effects-package",
    label: "Effects Package",
    title: "Effects Package",
    description: "Renderer-neutral effect descriptors with Canvas-first application and explicit WebGL pass planning.",
    sections: [
      {
        title: "Package Role",
        body: "raw2d-effects owns effect descriptors and validation only. It does not import Canvas, WebGL, DOM APIs, shaders, or scene objects.",
        code: `import { createBlurEffect, createOpacityEffect, validateRaw2DEffects } from "raw2d-effects";

const effects = [
  createOpacityEffect(0.75, "fade"),
  createBlurEffect(4, "soften")
];

const result = validateRaw2DEffects(effects);`
      },
      {
        title: "Current Descriptors",
        body: "The first descriptor set is opacity, blur, grayscale, and shadow. Values stay plain data so renderers can decide how and when to apply them.",
        code: `createOpacityEffect(0.8);
createBlurEffect(6);
createGrayscaleEffect(0.35);
createShadowEffect({ color: "rgba(0,0,0,0.35)", blur: 12, offsetX: 6, offsetY: 8 });`
      },
      {
        title: "Canvas First",
        body: "Canvas applies descriptors through an explicit render option. The object remains renderer-neutral; the renderer asks for effects and scopes Canvas state around each draw.",
        code: `renderer.render(scene, camera, {
  effects: (object) => object.name === "soft-orb" ? [createBlurEffect(1.2)] : []
});`
      },
      {
        title: "WebGL Boundary",
        body: "WebGL exposes a pass plan before it executes effect shaders. Opacity maps to a future draw-batch alpha pass, while grayscale, blur, and shadow need framebuffer shader passes.",
        code: `import { createWebGLEffectPassPlan } from "raw2d-webgl";

const plan = createWebGLEffectPassPlan({ effects });

console.log(plan.inlinePasses);
console.log(plan.shaderPasses);
console.log(plan.requiresFramebuffer);`
      },
      {
        title: "Non-goals",
        body: "The effects package is not a filter engine, post-processing pipeline, shader library, or scene graph extension. Renderer packages own execution details and support limits."
      }
    ]
  }
];
