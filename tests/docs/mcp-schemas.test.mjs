import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocMcpTopics.ts", "utf8");
const readme = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hiReadme = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");
const markdown = readFileSync("docs/Raw2DMCPSchemas.md", "utf8");
const hiMarkdown = readFileSync("docs/hi/Raw2DMCPSchemas.md", "utf8");
const packageReadme = readFileSync("packages/mcp/README.md", "utf8");

const toolNames = [
  "raw2d_create_scene",
  "raw2d_add_object",
  "raw2d_update_transform",
  "raw2d_update_material",
  "raw2d_inspect_scene",
  "raw2d_validate_scene",
  "raw2d_generate_canvas_example",
  "raw2d_generate_webgl_example",
  "raw2d_generate_docs_snippet",
  "raw2d_run_visual_check"
];

test("MCP schema docs cover every public tool", () => {
  for (const toolName of toolNames) {
    assert.match(markdown, new RegExp(toolName));
    assert.match(hiMarkdown, new RegExp(toolName));
    assert.match(topic, new RegExp(toolName));
  }
});

test("MCP schema docs are registered in readme routes", () => {
  assert.match(readme, /Raw2DMCPSchemas\.md/);
  assert.match(hiReadme, /hi\/Raw2DMCPSchemas\.md/);
  assert.match(packageReadme, /Raw2DMCPSchemas\.md/);
});

test("MCP schema docs describe side effect boundaries", () => {
  assert.match(markdown, /do not draw, write files, publish packages, or push Git/);
  assert.match(markdown, /commands: \{ command: string; args: string\[\] \}\[\]/);
});
