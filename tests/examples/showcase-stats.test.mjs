import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/showcase/index.html", "utf8");
const main = readFileSync("examples/showcase/main.ts", "utf8");
const stats = readFileSync("examples/showcase/showcaseStats.ts", "utf8");

test("showcase exposes copyable live renderer stats", () => {
  assert.match(html, /id="raw2d-copy-report"/);
  assert.match(html, /id="raw2d-showcase-status"/);
  assert.match(main, /latestReport/);
  assert.match(main, /updateShowcaseStatus/);
  assert.match(main, /navigator\.clipboard/);
  assert.match(main, /buildShowcaseStatsReport/);
});

test("showcase stats report includes renderer and WebGL diagnostics", () => {
  assert.match(stats, /renderer:/);
  assert.match(stats, /drawCalls:/);
  assert.match(stats, /textureBinds:/);
  assert.match(stats, /interaction:/);
});
