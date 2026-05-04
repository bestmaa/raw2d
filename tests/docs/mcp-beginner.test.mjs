import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocMCPBeginnerTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/Raw2DMCPBeginner.md", "utf8");
const hinglish = readFileSync("docs/hi/Raw2DMCPBeginner.md", "utf8");

test("MCP beginner docs cover the first scene automation flow", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /raw2d-mcp/);
    assert.match(content, /createRaw2DSceneJson/);
    assert.match(content, /addRaw2DSceneObject/);
    assert.match(content, /validateRaw2DScene/);
    assert.match(content, /generateRaw2DCanvasExample/);
  }
});

test("MCP beginner topic is registered before advanced MCP docs", () => {
  assert.match(topic, /mcp-beginner/);
  assert.match(topics, /mcpBeginnerTopics/);
  assert.ok(topics.indexOf("...mcpBeginnerTopics") < topics.indexOf("...mcpTopics"));
});
