import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

test("JSX mapping docs cover renderer, scene, camera, and objects", () => {
  const english = read("docs/Raw2DJSXMappingDesign.md");
  const hinglish = read("docs/hi/Raw2DJSXMappingDesign.md");

  for (const content of [english, hinglish]) {
    assert.match(content, /Raw2DCanvas/);
    assert.match(content, /rawScene/);
    assert.match(content, /rawCamera/);
    assert.match(content, /rawRect/);
    assert.match(content, /rawText2D/);
  }
});

test("JSX mapping is registered as a React docs topic", () => {
  const topics = read("src/pages/DocReactTopics.ts");

  assert.match(topics, /react-jsx-mapping/);
  assert.match(topics, /Identity And Updates/);
});
