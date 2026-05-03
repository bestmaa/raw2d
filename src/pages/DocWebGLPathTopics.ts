import type { DocTopic } from "./DocPage.type";

export const webGLPathTopics: readonly DocTopic[] = [
  {
    id: "webgl-path-guide",
    label: "WebGL Path Guide",
    title: "WebGL Path Guide",
    description: "A practical WebGL flow for support checks, renderer setup, batching stats, and diagnostics.",
    sections: [
      {
        title: "Check Support",
        body: "WebGLRenderer2D needs WebGL2. Check support first when your app must fall back to Canvas.",
        code: `import { isWebGL2Available } from "raw2d";

const canUseWebGL = isWebGL2Available({ canvas: canvasElement });`
      },
      {
        title: "Choose Renderer",
        body: "Keep scene and camera code the same. Only the renderer changes between Canvas and WebGL.",
        code: `import { Canvas, WebGLRenderer2D } from "raw2d";

const renderer = canUseWebGL
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });`
      },
      {
        title: "Render Supported Objects",
        body: "WebGL supports the high-volume object path first: primitives, sprites, and rasterized Text2D.",
        liveDemoId: "webgl-renderer",
        code: `scene.add(rect);
scene.add(sprite);
scene.add(label);

renderer.render(scene, camera);`
      },
      {
        title: "Read Batch Stats",
        body: "Stats explain what WebGL did this frame: render-list count, batches, draw calls, and uploads.",
        liveDemoId: "webgl-performance",
        code: `renderer.render(scene, camera, { culling: true });

const stats = renderer.getStats();
console.log(stats.objects);
console.log(stats.batches);
console.log(stats.drawCalls);
console.log(stats.uploadedBytes);`
      },
      {
        title: "Read Texture Diagnostics",
        body: "Sprite-heavy scenes should watch texture binds and uploads. Atlas packing should reduce both.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.log(stats.textureBinds);
console.log(stats.textureUploads);
console.log(stats.spriteTextureBindReduction);`
      },
      {
        title: "Keep Canvas Fallback",
        body: "Canvas remains the reference renderer. Use it for unsupported devices, debugging, and full object coverage.",
        code: `const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });

renderer.render(scene, camera);`
      }
    ]
  }
];
