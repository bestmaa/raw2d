import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const source = readFileSync("src/pages/DocBeginnerPathTopics.ts", "utf8");

test("beginner path covers the install-to-render learning flow", () => {
  assert.match(source, /npm install raw2d/);
  assert.match(source, /HTMLCanvasElement/);
  assert.match(source, /new Canvas/);
  assert.match(source, /new Scene/);
  assert.match(source, /new Camera2D/);
  assert.match(source, /new Rect/);
});

test("beginner path covers texture, WebGL, and examples next steps", () => {
  assert.match(source, /new Texture/);
  assert.match(source, /new Sprite/);
  assert.match(source, /WebGLRenderer2D/);
  assert.match(source, /isWebGL2Available/);
  assert.ok(source.includes("/examples/sprite-atlas/"));
});

test("beginner path sends users to Studio after examples", () => {
  assert.match(source, /Open Studio After Examples/);
  assert.match(source, /\/doc#studio-shell/);
  assert.match(source, /\/doc#studio-tools/);
  assert.match(source, /\/doc#studio-scene-format/);
  assert.match(source, /\/studio/);
  assert.ok(source.indexOf("8. Next Examples") < source.indexOf("9. Open Studio After Examples"));
});
