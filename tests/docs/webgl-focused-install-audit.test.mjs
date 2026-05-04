import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocBetaInstallTopics.ts", "utf8");
const english = readFileSync("docs/WebGLFocusedInstallAudit.md", "utf8");
const hinglish = readFileSync("docs/hi/WebGLFocusedInstallAudit.md", "utf8");
const smoke = readFileSync("scripts/webgl-focused-install-smoke.mjs", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");

test("WebGL focused install audit documents the core plus WebGL path", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm run test:consumer:webgl/);
    assert.match(content, /raw2d-core raw2d-webgl/);
    assert.doesNotMatch(content, /npm install raw2d-canvas/);
  }
});

test("WebGL focused smoke stays WebGL-only and builds a render path", () => {
  assert.match(smoke, /packages\/core/);
  assert.match(smoke, /packages\/webgl/);
  assert.doesNotMatch(smoke, /packages\/canvas/);
  assert.match(smoke, /WebGLRenderer2D/);
  assert.match(smoke, /webgl-focused-runtime-ok/);
});

test("WebGL focused install audit is registered in docs navigation", () => {
  assert.match(topics, /betaInstallTopics/);
  assert.match(topic, /webgl-focused-install/);
});
