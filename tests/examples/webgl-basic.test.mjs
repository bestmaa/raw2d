import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/webgl-basic/index.html", "utf8");
const source = readFileSync("examples/webgl-basic/main.ts", "utf8");

test("WebGL basic example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /WebGL Sprite Batching/);
  assert.match(html, /raw2d-stats/);
});

test("WebGL basic example demonstrates Sprite batching stats", () => {
  assert.match(source, /new WebGLRenderer2D/);
  assert.match(source, /new Sprite/);
  assert.match(source, /new Texture/);
  assert.match(source, /spriteSorting: "texture"/);
  assert.match(source, /spriteTextureBindReduction/);
});
