import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocBetaInstallTopics.ts", "utf8");
const english = readFileSync("docs/CanvasFocusedInstallAudit.md", "utf8");
const hinglish = readFileSync("docs/hi/CanvasFocusedInstallAudit.md", "utf8");
const smoke = readFileSync("scripts/canvas-focused-install-smoke.mjs", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");

test("Canvas focused install audit documents the core plus canvas path", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm run test:consumer:canvas/);
    assert.match(content, /raw2d-core raw2d-canvas/);
    assert.doesNotMatch(content, /npm install raw2d-webgl/);
  }
});

test("Canvas focused smoke stays Canvas-only and renders a scene", () => {
  assert.match(smoke, /packages\/core/);
  assert.match(smoke, /packages\/canvas/);
  assert.doesNotMatch(smoke, /packages\/webgl/);
  assert.match(smoke, /renderer\.render\(scene, camera\)/);
  assert.match(smoke, /canvas-focused-runtime-ok/);
});

test("Canvas focused install audit is registered in docs navigation", () => {
  assert.match(topics, /betaInstallTopics/);
  assert.match(topic, /canvas-focused-install/);
});
