import assert from "node:assert/strict";
import test from "node:test";

import { addRaw2DSceneObject, createRaw2DSceneJson, generateRaw2DDocsSnippet } from "../../packages/mcp/dist/index.js";

test("generateRaw2DDocsSnippet creates markdown with scene summary and code", () => {
  const scene = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "rect", id: "card", width: 120, height: 80 }
  });
  const snippet = generateRaw2DDocsSnippet({
    document: scene,
    title: "Card Example",
    renderer: "canvas"
  });

  assert.equal(snippet.title, "Card Example");
  assert.match(snippet.markdown, /## Card Example/);
  assert.match(snippet.markdown, /Objects: `1`/);
  assert.match(snippet.markdown, /`rect`: 1/);
  assert.match(snippet.markdown, /```ts/);
  assert.match(snippet.markdown, /new Canvas/);
});

test("generateRaw2DDocsSnippet can use WebGL examples", () => {
  const snippet = generateRaw2DDocsSnippet({
    document: createRaw2DSceneJson(),
    renderer: "webgl2"
  });

  assert.match(snippet.markdown, /Scene has no objects yet/);
  assert.match(snippet.markdown, /new WebGLRenderer2D/);
});
