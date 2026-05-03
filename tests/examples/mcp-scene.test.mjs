import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/mcp-scene/index.html", "utf8");
const source = readFileSync("examples/mcp-scene/main.ts", "utf8");

test("MCP scene example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /Scene JSON/);
  assert.match(html, /raw2d-output/);
});

test("MCP scene example creates, validates, inspects, and renders JSON", () => {
  assert.match(source, /createRaw2DSceneJson/);
  assert.match(source, /addRaw2DSceneObject/);
  assert.match(source, /validateRaw2DScene/);
  assert.match(source, /inspectRaw2DScene/);
  assert.match(source, /generateRaw2DDocsSnippet/);
  assert.match(source, /new Canvas/);
});
