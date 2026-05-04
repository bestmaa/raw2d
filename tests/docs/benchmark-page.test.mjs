import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const page = readFileSync("src/pages/BenchmarkPage.ts", "utf8");
const controls = readFileSync("src/pages/BenchmarkPageControls.ts", "utf8");
const controlTypes = readFileSync("src/pages/BenchmarkPageControls.type.ts", "utf8");

test("benchmark page explains Canvas and WebGL tradeoffs", () => {
  assert.match(page, /How to read this/);
  assert.match(page, /Use Canvas as the simple reference renderer/);
  assert.match(page, /Use WebGL when object count/);
  assert.match(page, /frameMs, drawCalls, batches, textureBinds/);
});

test("benchmark page exposes repeatable presets and reset", () => {
  assert.match(controls, /Canvas reference/);
  assert.match(controls, /WebGL batch/);
  assert.match(controls, /Culling stress/);
  assert.match(page, /Reset/);
  assert.match(page, /benchmarkStatus/);
});

test("benchmark controls stay isolated from the page module", () => {
  assert.match(controlTypes, /BenchmarkPresetControls/);
  assert.match(page, /BenchmarkPageControls/);
  assert.doesNotMatch(page, /function createCountControl/);
});
