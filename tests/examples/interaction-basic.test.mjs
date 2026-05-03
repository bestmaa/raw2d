import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/interaction-basic/index.html", "utf8");
const source = readFileSync("examples/interaction-basic/main.ts", "utf8");

test("Interaction example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /Select, Drag, Resize/);
  assert.match(html, /raw2d-stats/);
});

test("Interaction example enables selection, drag, resize, and overlay state", () => {
  assert.match(source, /new InteractionController/);
  assert.match(source, /enableSelection/);
  assert.match(source, /enableDrag/);
  assert.match(source, /enableResize/);
  assert.match(source, /getResizeHandles/);
  assert.match(source, /getSelection/);
});
