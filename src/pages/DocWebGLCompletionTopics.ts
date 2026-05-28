import type { DocTopic } from "./DocPage.type";

export const webGLCompletionTopics: readonly DocTopic[] = [
  {
    id: "webgl-completion",
    label: "WebGL Completion",
    title: "WebGL Completion Status",
    description: "Read the current WebGL2 completion status, known tradeoffs, and the practical performance-reading flow.",
    sections: [
      {
        title: "Current Status",
        body: "WebGLRenderer2D is now the batch-first performance renderer for Raw2D. It covers shape geometry, Sprites, rasterized Text2D, atlas frames, culling, texture caching, static batch caching, static run compaction, context recovery, and visual parity coverage.",
        liveDemoId: "webgl-renderer",
        code: `const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "rasterize",
  curveSegments: 24
});

renderer.render(scene, camera, { culling: true });
console.log(renderer.getDiagnostics());`
      },
      {
        title: "Still Intentional",
        body: "Raw2D keeps Canvas as the complete reference renderer. WebGL remains transparent and modular: object data stays in core, Sprite and texture data stay in raw2d-sprite, text data stays in raw2d-text, and WebGL owns only the renderer-specific batch, cache, shader, and draw-call path.",
        code: `Scene -> RenderPipeline -> RenderRun -> Batcher -> Buffer -> Shader -> DrawCall`
      },
      {
        title: "Remaining Tradeoffs",
        body: "Complex ShapePath fills use the explicit raster fallback when direct geometry is not enough. Text2D uses raster textures rather than a glyph atlas. Sprite sorting is opt-in because automatic reordering can change visual stacking. Camera moves rebuild static batches because current vertices are projected into clip space.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera, {
  culling: true,
  spriteSorting: "texture"
});

const stats = webglRenderer.getStats();
console.log(stats.shapePathUnsupportedFills);
console.log(stats.spriteTextureBindReduction);
console.log(stats.staticCacheHits);`
      },
      {
        title: "Read Performance",
        body: "Start with render-list counts, then draw calls, texture binds, cache hits, and upload bytes. Warm static cache before timing, and compare Canvas and WebGL with the same scene, camera, viewport, and culling setting.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera, { culling: true });

const start = performance.now();
webglRenderer.render(scene, camera, { culling: true });
const frameMs = performance.now() - start;

const stats = webglRenderer.getStats();
console.log(frameMs);
console.log(stats.renderList);
console.log(stats.drawCalls, stats.textureBinds);
console.log(stats.staticCacheHits, stats.uploadedBytes);`
      },
      {
        title: "Completion Gate",
        body: "Use the browser visual pixel route and WebGL unit snapshots before release. The visual route covers Sprite, Text2D, ShapePath fallback, culling, and static cache signals through window.__raw2dPixelResult.",
        code: `npm run build:docs
node --test tests/browser/visual-pixel.test.mjs

const result = window.__raw2dPixelResult;
console.log(result.webgl.coverage);`
      }
    ]
  }
];
