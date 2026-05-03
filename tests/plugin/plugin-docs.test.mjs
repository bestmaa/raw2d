import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

test("plugin docs page is registered in the AI Tools group", () => {
  const topics = read("src/pages/DocPluginTopics.ts");
  const registry = read("src/pages/DocTopics.ts");

  assert.match(topics, /id: "codex-plugin"/);
  assert.match(topics, /scaffold-raw2d-app/);
  assert.match(topics, /run-docs-qa/);
  assert.match(registry, /pluginTopics/);
});

test("plugin README and docs explain skills, commands, and release boundaries", () => {
  const readme = read("plugins/raw2d/README.md");
  const englishDoc = read("docs/Raw2DCodexPlugin.md");
  const hindiDoc = read("docs/hi/Raw2DCodexPlugin.md");

  for (const content of [readme, englishDoc, hindiDoc]) {
    assert.match(content, /raw2d-doc-writer/);
    assert.match(content, /run-visual-pixel-tests/);
    assert.match(content, /publish|Release tasks|Release/);
  }
});

test("plugin workflow builds packages before plugin checks", () => {
  const workflow = read(".github/workflows/plugin.yml");

  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /node --test tests\/plugin\/\*\.test\.mjs/);
  assert.match(workflow, /run-docs-qa\.mjs/);
});
