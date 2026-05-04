import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocBetaInstallTopics.ts", "utf8");
const english = readFileSync("docs/UmbrellaBetaInstallAudit.md", "utf8");
const hinglish = readFileSync("docs/hi/UmbrellaBetaInstallAudit.md", "utf8");
const smoke = readFileSync("scripts/umbrella-install-smoke.mjs", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");

test("umbrella beta install audit documents the fresh Vite command", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm run test:consumer:umbrella/);
    assert.match(content, /raw2d/);
    assert.match(content, /Vite/i);
  }
});

test("umbrella install smoke renders a scene and checks runtime exports", () => {
  assert.match(smoke, /CanvasRenderer/);
  assert.match(smoke, /renderer\.render\(scene, camera\)/);
  assert.match(smoke, /umbrella-runtime-ok/);
  assert.match(smoke, /createWebGLShapeBatch/);
});

test("umbrella beta install audit is registered in docs navigation", () => {
  assert.match(topics, /betaInstallTopics/);
  assert.match(topic, /umbrella-beta-install/);
});
