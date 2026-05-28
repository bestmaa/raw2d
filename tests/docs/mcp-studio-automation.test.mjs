import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const englishDoc = readFileSync("docs/Raw2DMCPStudioAutomation.md", "utf8");
const hinglishDoc = readFileSync("docs/hi/Raw2DMCPStudioAutomation.md", "utf8");
const topic = readFileSync("src/pages/DocMcpTopics.ts", "utf8");
const readmeDocs = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hinglishReadmeDocs = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");
const packageReadme = readFileSync("packages/mcp/README.md", "utf8");

test("MCP Studio automation docs cover agent-safe boundaries", () => {
  for (const content of [englishDoc, hinglishDoc, topic, packageReadme]) {
    assert.match(content, /createRaw2DMcpSceneEditPlan/);
    assert.match(content, /validateRaw2DStudioScene/);
    assert.match(content, /generateRaw2DStudioExample/);
    assert.match(content, /write files|files write|write `.raw2d\.json`/i);
    assert.match(content, /Studio|studio/);
  }
});

test("MCP Studio automation docs are registered in README docs", () => {
  assert.match(readmeDocs, /Raw2DMCPStudioAutomation\.md/);
  assert.match(readmeDocs, /raw2d-mcp-studio-automation/);
  assert.match(hinglishReadmeDocs, /hi\/Raw2DMCPStudioAutomation\.md/);
  assert.match(hinglishReadmeDocs, /raw2d-mcp-studio-automation/);
});

test("MCP Studio automation docs describe review rules", () => {
  for (const content of [englishDoc, hinglishDoc]) {
    assert.match(content, /duplicate ids|duplicate ids/i);
    assert.match(content, /assetSlot/);
    assert.match(content, /WebGL warnings|WebGL warnings/i);
    assert.match(content, /destructive deletes/i);
  }
});
