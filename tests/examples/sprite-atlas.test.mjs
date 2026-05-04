import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/sprite-atlas/index.html", "utf8");
const source = readFileSync("examples/sprite-atlas/main.ts", "utf8");

test("Sprite atlas example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /Texture Atlas/);
  assert.match(html, /Atlas Frames/);
  assert.match(html, /raw2d-next-frame/);
  assert.match(html, /raw2d-stats/);
});

test("Sprite atlas example packs frames and renders sprites", () => {
  assert.match(source, /new TextureAtlasPacker/);
  assert.match(source, /packWithStats/);
  assert.match(source, /new Sprite/);
  assert.match(source, /atlas\.getFrame/);
  assert.match(source, /selectedFrame/);
  assert.match(source, /setOpacity/);
  assert.match(source, /spriteSorting: "texture"/);
});
