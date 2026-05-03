import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

test("React package docs explain install, primitives, sprite, and boundary", () => {
  const docs = [
    read("docs/Raw2DReactPackage.md"),
    read("docs/hi/Raw2DReactPackage.md"),
    read("packages/react/README.md")
  ];

  for (const content of docs) {
    assert.match(content, /raw2d-react/);
    assert.match(content, /Raw2DCanvas/);
    assert.match(content, /RawRect/);
    assert.match(content, /RawSprite/);
  }
});

test("React package docs are registered in the docs page", () => {
  const topics = read("src/pages/DocReactTopics.ts");

  assert.match(topics, /react-package/);
  assert.match(topics, /npm install raw2d raw2d-react react react-dom/);
});
