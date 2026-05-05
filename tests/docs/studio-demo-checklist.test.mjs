import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const english = readFileSync("docs/Raw2DStudioDemoChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/Raw2DStudioDemoChecklist.md", "utf8");
const routeTopics = readFileSync("src/pages/DocStudioDemoTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const readmeDocs = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hinglishReadmeDocs = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");

test("Studio demo checklist covers public demo workflow", () => {
  for (const content of [english, hinglish, routeTopics]) {
    assert.match(content, /studio\/|\/studio/);
    assert.match(content, /Sample/);
    assert.match(content, /Rect/);
    assert.match(content, /Properties/);
    assert.match(content, /raw2d\.json/);
    assert.match(content, /PNG/);
    assert.match(content, /phone width|phone/);
  }
});

test("Studio demo checklist is registered in docs and readme routes", () => {
  assert.match(topics, /studioDemoTopics/);
  assert.match(routeTopics, /studio-demo-checklist/);
  assert.match(readmeDocs, /Raw2DStudioDemoChecklist/);
  assert.match(readmeDocs, /studio-demo-checklist/);
  assert.match(hinglishReadmeDocs, /Raw2DStudioDemoChecklist/);
  assert.match(hinglishReadmeDocs, /studio-demo-checklist/);
});
