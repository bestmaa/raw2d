import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocEffectsTopics.ts", "utf8");
const topicsIndex = readFileSync("src/pages/DocTopics.ts", "utf8");
const readme = readFileSync("packages/effects/README.md", "utf8");
const coreIndex = readFileSync("packages/core/src/index.ts", "utf8");

test("effects docs cover APIs, non-goals, and renderer separation", () => {
  for (const content of [topic, readme]) {
    assert.match(content, /createOpacityEffect/);
    assert.match(content, /createBlurEffect/);
    assert.match(content, /createGrayscaleEffect/);
    assert.match(content, /createShadowEffect/);
    assert.match(content, /validateRaw2DEffects/);
    assert.match(content, /Non-goals/i);
    assert.match(content, /Canvas/i);
    assert.match(content, /WebGL/i);
  }
});

test("effects docs are routed without coupling core to effects", () => {
  assert.match(topicsIndex, /effectsTopics/);
  assert.match(topic, /effects-package/);
  assert.doesNotMatch(coreIndex, /raw2d-effects|Raw2DEffect|createOpacityEffect/);
});
