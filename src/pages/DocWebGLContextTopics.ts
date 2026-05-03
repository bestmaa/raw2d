import type { DocTopic } from "./DocPage.type";

export const webGLContextTopics: readonly DocTopic[] = [
  {
    id: "webgl-context-lifecycle",
    label: "WebGL Context",
    title: "WebGL Context Lifecycle",
    description: "WebGL contexts can be lost by the browser. Raw2D skips rendering while lost and recreates GPU resources after restore.",
    sections: [
      {
        title: "Detect Context Loss",
        body: "WebGLRenderer2D listens for browser context loss events. While lost, render does not upload buffers, bind textures, or draw.",
        liveDemoId: "webgl-performance",
        code: `renderer.render(scene, camera);

if (renderer.isContextLost()) {
  console.log("WebGL is waiting for restore");
}`
      },
      {
        title: "Read Diagnostics",
        body: "Diagnostics keep context state and render stats in one stable object. Use it for debug overlays, logs, and fallback decisions.",
        liveDemoId: "webgl-performance",
        code: `const diagnostics = renderer.getDiagnostics();

console.log(diagnostics.contextLost);
console.log(diagnostics.stats.objects);
console.log(diagnostics.stats.drawCalls);
console.log(diagnostics.textureCacheSize);`
      },
      {
        title: "Restore Recreates Resources",
        body: "After webglcontextrestored, Raw2D recreates shader programs, buffer uploaders, static caches, and texture caches. Scene objects are still your normal data objects.",
        code: `// Browser fires webglcontextrestored.
// Raw2D rebuilds GPU resources internally.

renderer.render(scene, camera);
console.log(renderer.getStats().textureUploads);`
      },
      {
        title: "Canvas Fallback",
        body: "Raw2D keeps Canvas and WebGL separate. If WebGL2 is unavailable or the context is lost for too long, render the same Scene with Canvas.",
        code: `const renderer = isWebGL2Available(canvas)
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });

renderer.render(scene, camera);`
      },
      {
        title: "Animation Loop",
        body: "Keep your loop explicit. Skip app-specific drawing work while context is lost, then continue rendering after restore.",
        code: `function frame(): void {
  if (!renderer.isContextLost()) {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(frame);
}

frame();`
      },
      {
        title: "Dispose Separately",
        body: "Context restore handles browser GPU resets. Dispose is still for app lifecycle cleanup when the canvas or renderer is no longer used.",
        code: `renderer.clearTextureCache();
renderer.dispose();`
      }
    ]
  }
];
