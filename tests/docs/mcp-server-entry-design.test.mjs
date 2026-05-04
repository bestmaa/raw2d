import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocMcpTopics.ts", "utf8");
const readme = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hiReadme = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");
const markdown = readFileSync("docs/Raw2DMCPServerEntry.md", "utf8");
const hiMarkdown = readFileSync("docs/hi/Raw2DMCPServerEntry.md", "utf8");
const packageReadme = readFileSync("packages/mcp/README.md", "utf8");

test("MCP server entry design is documented and routed", () => {
  assert.match(topic, /Server Entry Design/);
  assert.match(readme, /Raw2DMCPServerEntry\.md/);
  assert.match(hiReadme, /hi\/Raw2DMCPServerEntry\.md/);
});

test("MCP server entry stays decoupled from browser packages", () => {
  for (const content of [markdown, hiMarkdown, topic, packageReadme]) {
    assert.match(content, /stdio/);
    assert.match(content, /raw2d-core/);
    assert.match(content, /raw2d-canvas/);
    assert.match(content, /raw2d-webgl/);
    assert.match(content, /browser/);
  }
});

test("MCP server entry defines future bin and dispatch rules", () => {
  assert.match(markdown, /"raw2d-mcp": "\.\/dist\/server\.js"/);
  assert.match(markdown, /raw2d_create_scene/);
  assert.match(markdown, /raw2d_validate_scene/);
});
