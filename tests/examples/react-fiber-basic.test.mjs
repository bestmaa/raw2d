import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/react-fiber-basic/index.html", "utf8");
const source = readFileSync("examples/react-fiber-basic/main.ts", "utf8");

test("React Fiber example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /React Fiber host config/);
  assert.match(html, /raw2d-react-fiber/);
});

test("React Fiber example uses host config and interaction bridge", () => {
  assert.match(source, /createRaw2DFiberHostConfig/);
  assert.match(source, /createRaw2DFiberInteractionBridge/);
  assert.match(source, /host\.createInstance\("rawRect"/);
  assert.match(source, /host\.appendChild\(scene, instance\)/);
  assert.match(source, /bridge\.attachInstances/);
});

test("React Fiber example documents install and update flow", () => {
  assert.match(source, /npm install raw2d raw2d-react-fiber react react-dom/);
  assert.match(source, /fiber-shift/);
  assert.match(source, /fiber-reset/);
  assert.match(source, /package: raw2d-react-fiber/);
});
