import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const index = readFileSync("examples/index.html", "utf8");
const css = readFileSync("examples/shared/example.css", "utf8");
const browserSmoke = readFileSync("tests/browser/smoke.test.mjs", "utf8");

test("examples index links core example routes", () => {
  for (const route of [
    "canvas-basic",
    "webgl-basic",
    "showcase",
    "sprite-atlas",
    "interaction-basic",
    "text-basic",
    "mcp-scene",
    "react-basic"
  ]) {
    assert.match(index, new RegExp(`href="./${route}/"`));
  }
});

test("examples index uses shared example styles", () => {
  assert.match(index, /shared\/example\.css/);
  assert.match(index, /src="\.\/main\.ts"/);
  assert.match(css, /\.example-shell/);
  assert.match(css, /\.example-card/);
});

test("browser smoke covers examples index route", () => {
  assert.match(browserSmoke, /\/examples\//);
  assert.match(browserSmoke, /\/examples\/main\.ts/);
});

test("examples index exposes copyable install commands", () => {
  assert.match(index, /Package install commands/);
  assert.match(index, /data-copy-command="npm install raw2d"/);
  assert.match(index, /data-copy-command="npm install raw2d-core raw2d-canvas"/);
  assert.match(index, /data-copy-command="npm install raw2d-core raw2d-webgl"/);
  assert.match(index, /data-copy-command="npm install raw2d raw2d-react react react-dom"/);
});
