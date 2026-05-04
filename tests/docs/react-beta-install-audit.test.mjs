import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocBetaInstallTopics.ts", "utf8");
const english = readFileSync("docs/ReactBetaInstallAudit.md", "utf8");
const hinglish = readFileSync("docs/hi/ReactBetaInstallAudit.md", "utf8");
const smoke = readFileSync("scripts/react-install-smoke.mjs", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");

test("React beta install audit documents the React bridge install path", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm run test:consumer:react/);
    assert.match(content, /raw2d-react/);
    assert.match(content, /react react-dom/);
  }
});

test("React install smoke covers current bridge components", () => {
  for (const component of ["Raw2DCanvas", "RawRect", "RawCircle", "RawSprite", "RawText2D"]) {
    assert.match(smoke, new RegExp(component));
  }
  assert.match(smoke, /react-runtime-ok/);
});

test("React beta install audit is registered in docs navigation", () => {
  assert.match(topics, /betaInstallTopics/);
  assert.match(topic, /react-beta-install/);
});
