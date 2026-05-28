import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocPublishTopics.ts", "utf8");
const english = readFileSync("docs/NpmPublishChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/NpmPublishChecklist.md", "utf8");

test("npm publish checklist documents release gates", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm test/);
    assert.match(content, /pack:check/);
    assert.match(content, /audit:package/);
    assert.match(content, /test:consumer/);
    assert.match(content, /GitHub/);
    assert.match(content, /tag/);
  }
});

test("npm publish checklist includes npm and CDN verification", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm view raw2d version/);
    assert.match(content, /raw2d-webgl/);
    assert.match(content, /jsDelivr|cdn\.jsdelivr/i);
  }
});

test("npm publish checklist verifies every fixed-version package", () => {
  const packages = [
    "raw2d",
    "raw2d-core",
    "raw2d-canvas",
    "raw2d-webgl",
    "raw2d-sprite",
    "raw2d-text",
    "raw2d-effects",
    "raw2d-interaction",
    "raw2d-mcp",
    "raw2d-react",
    "raw2d-react-fiber"
  ];

  for (const packageName of packages) {
    assert.match(topic, new RegExp(`npm view ${packageName} version`));
    assert.match(english, new RegExp(packageName));
    assert.match(hinglish, new RegExp(packageName));
  }
});
