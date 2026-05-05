import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const englishFormat = readFileSync("docs/Raw2DStudioSceneFormat.md", "utf8");
const hinglishFormat = readFileSync("docs/hi/Raw2DStudioSceneFormat.md", "utf8");
const routeTopics = readFileSync("src/pages/DocStudioTopics.ts", "utf8");
const readmeDocs = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hinglishReadmeDocs = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");

test("Studio persistence docs cover save load export", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /Save/);
    assert.match(content, /Load/);
    assert.match(content, /Export/);
    assert.match(content, /raw2d\.json/);
    assert.match(content, /PNG/);
  }
});

test("Studio persistence docs show current scene schema", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /rendererMode/);
    assert.match(content, /"objects": \[\]/);
    assert.doesNotMatch(content, /"scene": \{ "objects"/);
  }
});

test("Studio persistence docs are available from readme docs", () => {
  assert.match(readmeDocs, /Raw2DStudioSceneFormat/);
  assert.match(readmeDocs, /studio-scene-format/);
  assert.match(hinglishReadmeDocs, /Raw2DStudioSceneFormat/);
  assert.match(hinglishReadmeDocs, /studio-scene-format/);
});
