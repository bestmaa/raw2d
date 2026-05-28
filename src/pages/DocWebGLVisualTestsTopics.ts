import type { DocTopic } from "./DocPage.type";

export const webGLVisualTestsTopics: readonly DocTopic[] = [
  {
    id: "webgl-visual-tests",
    label: "WebGL Visual Tests",
    title: "WebGL Visual Tests",
    description: "Use a tiny browser page to verify that Canvas and WebGL draw non-empty parity pixels.",
    sections: [
      {
        title: "Open The Pixel Page",
        body: "The page renders the same scene through Canvas and WebGL, then exposes pixel hashes and coverage signals on window.__raw2dPixelResult.",
        code: `npm run dev

http://localhost:5174/visual-test`
      },
      {
        title: "Read The Result",
        body: "Each renderer reports status, hash, non-background coloredPixels, width, height, coverage, and a short message. The matrix rows also report Canvas and WebGL status for every supported object kind.",
        code: `const result = window.__raw2dPixelResult;

console.log(result.canvas.status);
console.log(result.canvas.hash);
console.log(result.webgl.status);
console.log(result.webgl.coloredPixels);
console.log(result.webgl.coverage.sprites);
console.log(result.webgl.coverage.staticCacheHits);
console.table(result.matrix);`
      },
      {
        title: "Covered Features",
        body: "The visual scene includes Sprite, Text2D, ShapePath raster fallback, culling, and static render mode. The matrix separately checks Rect, Circle, Ellipse, Arc, Line, Polyline, Polygon, ShapePath, Sprite, Text2D, and Group2D.",
        code: `if (result.webgl.status === "passed") {
  console.log(result.webgl.coverage.shapePaths);
  console.log(result.webgl.coverage.culled);
  console.log(result.webgl.coverage.staticBatches);
  console.log(result.matrix.length);
}`
      },
      {
        title: "Keep It Simple",
        body: "Use this as a browser smoke test. Unit tests still lock geometry snapshots, while this page checks real browser pixels.",
        code: `if (result.canvas.status !== "passed") {
  throw new Error("Canvas visual test failed.");
}

if (result.webgl.status === "failed") {
  throw new Error("WebGL visual test failed.");
}`
      }
    ]
  }
];
