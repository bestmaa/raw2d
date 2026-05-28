import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const docTopics = readFileSync("src/pages/DocTopics.ts", "utf8");
const readmeDocs = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const readmeHinglishDocs = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");
const docHinglish = readFileSync("src/pages/DocHinglish.ts", "utf8");
const completionDoc = readFileSync("docs/WebGLCompletion.md", "utf8");
const completionHinglishDoc = readFileSync("docs/hi/WebGLCompletion.md", "utf8");
const webglReadme = readFileSync("packages/webgl/README.md", "utf8");

test("WebGL completion topic is registered in docs and readme routes", () => {
  assert.match(docTopics, /webGLCompletionTopics/);
  assert.match(readmeDocs, /WebGLCompletion\.md/);
  assert.match(readmeHinglishDocs, /hi\/WebGLCompletion\.md/);
  assert.match(docHinglish, /webgl-completion/);
});

test("WebGL completion docs cover status, tradeoffs, and performance reading", () => {
  assert.match(completionDoc, /batch-first performance renderer/);
  assert.match(completionDoc, /Remaining Tradeoffs/);
  assert.match(completionDoc, /Performance Reading/);
  assert.match(completionDoc, /static run compaction/);
  assert.match(completionDoc, /window\.__raw2dPixelResult/);
  assert.match(completionHinglishDoc, /WebGLRenderer2D/);
  assert.match(completionHinglishDoc, /Performance Reading/);
});

test("WebGL README explains completion tradeoffs without stale future wording", () => {
  assert.match(webglReadme, /complete reference renderer/);
  assert.match(webglReadme, /Remaining tradeoffs are explicit/);
  assert.doesNotMatch(webglReadme, /static batch compaction are future steps/);
});
