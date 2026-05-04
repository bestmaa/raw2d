import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const readme = readFileSync("examples/README.md", "utf8");

test("examples README documents local run commands", () => {
  assert.match(readme, /npm install/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /localhost:5174\/examples/);
});

test("examples README covers core example routes and package imports", () => {
  assert.match(readme, /canvas-basic/);
  assert.match(readme, /webgl-basic/);
  assert.match(readme, /sprite-atlas/);
  assert.match(readme, /interaction-basic/);
  assert.match(readme, /camera-controls/);
  assert.match(readme, /shape-path/);
  assert.match(readme, /raw2d-react/);
  assert.match(readme, /raw2d-mcp/);
  assert.match(readme, /npm install raw2d-core raw2d-canvas/);
  assert.match(readme, /npm install raw2d-core raw2d-webgl/);
});
