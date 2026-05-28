import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("React Fiber boundary docs mention the scaffolded package boundary", async () => {
  const [english, hinglish, readme] = await Promise.all([
    readFile("docs/ReactFiberBoundary.md", "utf8"),
    readFile("docs/hi/ReactFiberBoundary.md", "utf8"),
    readFile("packages/react-fiber/README.md", "utf8")
  ]);

  for (const content of [english, hinglish, readme]) {
    assert.match(content, /raw2d-react-fiber/);
    assert.match(content, /raw2d-core/);
    assert.match(content, /raw2d-webgl/);
  }

  assert.match(readme, /custom reconciler boundary/);
  assert.match(readme, /host config helpers/);
});
