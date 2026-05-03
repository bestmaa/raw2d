import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/react-basic/index.html", "utf8");
const source = readFileSync("examples/react-basic/main.ts", "utf8");

test("React example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /React Bridge/);
  assert.match(html, /raw2d-react/);
});

test("React example renders Raw2D components through raw2d-react", () => {
  assert.match(source, /createRoot/);
  assert.match(source, /Raw2DCanvas/);
  assert.match(source, /RawRect/);
  assert.match(source, /RawCircle/);
  assert.match(source, /RawSprite/);
  assert.match(source, /RawText2D/);
});
