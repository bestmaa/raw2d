import type { DocTopic } from "./DocPage.type";

export const webGLVisualTestsTopics: readonly DocTopic[] = [
  {
    id: "webgl-visual-tests",
    label: "WebGL Visual Tests",
    title: "WebGL Visual Tests",
    description: "Use a tiny browser page to verify that Canvas and WebGL draw non-empty pixels.",
    sections: [
      {
        title: "Open The Pixel Page",
        body: "The page renders the same scene through Canvas and WebGL, then exposes pixel hashes on window.__raw2dPixelResult.",
        code: `npm run dev

http://localhost:5174/visual-test`
      },
      {
        title: "Read The Result",
        body: "Each renderer reports status, hash, non-background coloredPixels, width, height, and a short message. WebGL can be unavailable on devices without WebGL2.",
        code: `const result = window.__raw2dPixelResult;

console.log(result.canvas.status);
console.log(result.canvas.hash);
console.log(result.webgl.status);
console.log(result.webgl.coloredPixels);`
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
