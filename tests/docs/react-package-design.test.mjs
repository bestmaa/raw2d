import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

test("React package design keeps React outside runtime packages", () => {
  const english = read("docs/Raw2DReactPackageDesign.md");
  const hinglish = read("docs/hi/Raw2DReactPackageDesign.md");

  for (const content of [english, hinglish]) {
    assert.match(content, /raw2d-react/);
    assert.match(content, /no React/);
    assert.match(content, /Core API/);
  }
});

test("React package design is registered in docs navigation", () => {
  const topics = read("src/pages/DocReactTopics.ts");
  const registry = read("src/pages/DocTopics.ts");

  assert.match(topics, /react-package-design/);
  assert.match(topics, /Raw2DCanvas/);
  assert.match(registry, /reactTopics/);
  assert.match(registry, /react-later/);
});
