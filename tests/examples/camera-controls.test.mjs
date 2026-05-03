import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/camera-controls/index.html", "utf8");
const source = readFileSync("examples/camera-controls/main.ts", "utf8");

test("Camera controls example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /Camera Pan \/ Zoom/);
  assert.match(html, /raw2d-reset/);
  assert.match(html, /raw2d-stats/);
});

test("Camera controls example enables pan, zoom, and reset", () => {
  assert.match(source, /new CameraControls/);
  assert.match(source, /enablePan/);
  assert.match(source, /enableZoom/);
  assert.match(source, /setPosition\(0, 0\)/);
  assert.match(source, /setZoom\(1\)/);
});
