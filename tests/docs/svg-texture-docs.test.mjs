import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocTexturePathTopics.ts", "utf8");
const readme = readFileSync("packages/sprite/README.md", "utf8");
const webglIndex = readFileSync("packages/webgl/src/index.ts", "utf8");

test("SVG texture docs explain rasterization through the sprite boundary", () => {
  for (const content of [topic, readme]) {
    assert.match(content, /createSvgTexture/);
    assert.match(content, /rasterizeSvgToCanvas|Rasterize SVG Texture/);
    assert.match(content, /WebGL/);
    assert.match(content, /Texture/);
  }
});

test("WebGL package does not own SVG-specific imports", () => {
  assert.doesNotMatch(webglIndex, /createSvgTexture|rasterizeSvgToCanvas|SvgTexture/);
});
