import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const coreIndex = readFileSync("packages/core/src/index.ts", "utf8");
const webglReadme = readFileSync("packages/webgl/README.md", "utf8");
const webglIndex = readFileSync("packages/webgl/src/index.ts", "utf8");

test("WebGL effects boundary is documented as renderer-owned pass planning", () => {
  assert.match(webglReadme, /Raw2DEffect\[\] -> WebGLEffectPassPlan/);
  assert.match(webglReadme, /draw-batch pass \| framebuffer shader pass/);
  assert.match(webglReadme, /not full WebGL effect execution yet/i);
});

test("WebGL effects boundary stays outside core", () => {
  assert.doesNotMatch(coreIndex, /raw2d-effects|Raw2DEffect|WebGLEffectPass/);
  assert.match(webglIndex, /createWebGLEffectPassPlan/);
  assert.match(webglIndex, /WebGLEffectPass\.type/);
});
