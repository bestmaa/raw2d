import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/showcase/index.html", "utf8");
const main = readFileSync("examples/showcase/main.ts", "utf8");
const renderer = readFileSync("examples/showcase/showcaseRenderer.ts", "utf8");
const docs = readFileSync("docs/ShowcaseDemo.md", "utf8");

test("showcase exposes a Canvas and WebGL renderer switch", () => {
  assert.match(html, /id="raw2d-renderer"/);
  assert.match(html, /value="canvas"/);
  assert.match(html, /value="webgl"/);
  assert.match(main, /rendererInput\.addEventListener\("change"/);
});

test("showcase renderer factory supports WebGL fallback", () => {
  assert.match(renderer, /isWebGL2Available/);
  assert.match(renderer, /new WebGLRenderer2D/);
  assert.match(renderer, /new Canvas/);
  assert.match(docs, /Canvas\/WebGL renderer switch/);
});
