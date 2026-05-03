import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocInstallSmokeTopics.ts", "utf8");
const english = readFileSync("docs/InstallSmokeInstructions.md", "utf8");
const hinglish = readFileSync("docs/hi/InstallSmokeInstructions.md", "utf8");

test("install smoke instructions cover fresh Vite app setup", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /create vite/);
    assert.match(content, /npm install raw2d/);
    assert.match(content, /npm run build/);
  }
});

test("install smoke instructions cover umbrella and focused imports", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /from "raw2d"/);
    assert.match(content, /from "raw2d-core"/);
    assert.match(content, /from "raw2d-canvas"/);
    assert.match(content, /CanvasRenderer/);
  }
});
