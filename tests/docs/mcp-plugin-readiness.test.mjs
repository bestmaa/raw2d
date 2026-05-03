import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocMCPReadinessTopics.ts", "utf8");
const english = readFileSync("docs/MCPPluginReadinessChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/MCPPluginReadinessChecklist.md", "utf8");

test("MCP plugin readiness covers package and plugin checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /raw2d-mcp/);
    assert.match(content, /plugin\.json/);
    assert.match(content, /tests\/mcp/);
  }
});

test("MCP plugin readiness covers skills and verification rules", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /raw2d-doc-writer/);
    assert.match(content, /raw2d-feature-builder/);
    assert.match(content, /raw2d-visual-check/);
    assert.match(content, /verification/i);
  }
});
