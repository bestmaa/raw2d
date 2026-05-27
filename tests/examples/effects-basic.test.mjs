import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/effects-basic/index.html", "utf8");
const source = readFileSync("examples/effects-basic/main.ts", "utf8");

test("Effects basic example uses shared layout and route controls", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /Effects Basic/);
  assert.match(html, /raw2d-toggle-effects/);
  assert.match(html, /raw2d-webgl-plan/);
  assert.match(html, /npm install raw2d raw2d-webgl/);
});

test("Effects basic example renders Canvas effects and WebGL support limits", () => {
  assert.match(source, /new Canvas/);
  assert.match(source, /createShadowEffect/);
  assert.match(source, /createOpacityEffect/);
  assert.match(source, /createBlurEffect/);
  assert.match(source, /createGrayscaleEffect/);
  assert.match(source, /createWebGLEffectPassPlan/);
  assert.match(source, /requiresFramebuffer/);
});
