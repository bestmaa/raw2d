import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const englishDoc = readFileSync("docs/Raw2DMCPPluginConsumer.md", "utf8");
const hinglishDoc = readFileSync("docs/hi/Raw2DMCPPluginConsumer.md", "utf8");
const readmeDocs = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hinglishReadmeDocs = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");
const pluginTopics = readFileSync("src/pages/DocPluginTopics.ts", "utf8");

test("MCP/plugin consumer guide explains package and plugin boundaries", () => {
  for (const content of [englishDoc, hinglishDoc]) {
    assert.match(content, /raw2d-mcp/);
    assert.match(content, /plugins\/raw2d/);
    assert.match(content, /create-raw2d-showcase/);
    assert.match(content, /run-fresh-install-audit/);
    assert.match(content, /publish|release|Release/);
  }
});

test("MCP/plugin consumer guide is registered in readme routes", () => {
  assert.match(readmeDocs, /Raw2DMCPPluginConsumer\.md/);
  assert.match(hinglishReadmeDocs, /hi\/Raw2DMCPPluginConsumer\.md/);
});

test("MCP/plugin consumer flow is visible on the docs route", () => {
  assert.match(pluginTopics, /MCP And Plugin Consumer Flow/);
  assert.match(pluginTopics, /npm install raw2d-mcp raw2d/);
});
