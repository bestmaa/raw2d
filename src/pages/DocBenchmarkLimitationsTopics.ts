import type { DocTopic } from "./DocPage.type";

export const benchmarkLimitationsTopics: readonly DocTopic[] = [
  {
    id: "benchmark-limitations",
    label: "Benchmark Limits",
    title: "Benchmark Limitations",
    description: "Use Raw2D benchmark numbers as local signals, not universal renderer rankings.",
    sections: [
      {
        title: "Browser Timing Is Noisy",
        body: "FPS and frame time depend on browser throttling, tab focus, GPU driver, power mode, and DevTools state. Compare trends on the same device instead of copying one number.",
        code: `// Good:
// Canvas: 280 objects, same browser, same controls
// WebGL: 280 objects, same browser, same controls

// Avoid:
// Comparing one laptop result with another phone result.`
      },
      {
        title: "Scene Shape Matters",
        body: "Rect-heavy, sprite-heavy, text-heavy, and mixed scenes stress different renderer paths. Change object type, static ratio, atlas, and culling before deciding.",
        code: `// A sprite atlas can lower WebGL texture binds.
// Culling can lower both Canvas and WebGL object work.
// Static objects can hit WebGL cache paths.`
      },
      {
        title: "Canvas Is Still Useful",
        body: "A lower benchmark ceiling does not make Canvas obsolete. Canvas remains the simple reference path for debugging, editor tools, and smaller scenes.",
        code: `const renderer = debugMode
  ? new Canvas({ canvas })
  : new WebGLRenderer2D({ canvas });`
      },
      {
        title: "Use Benchmarks With Diagnostics",
        body: "Read FPS together with draw calls, texture binds, static batches, dynamic batches, and culling counts. One metric alone rarely explains performance.",
        code: `const stats = renderer.getStats();

console.log(stats.drawCalls);
console.log(stats.renderList.culled);
console.log(stats.objects);`
      }
    ]
  }
];
