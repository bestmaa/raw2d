import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const skillRoot = path.join(root, "plugins", "raw2d", "skills", "raw2d-doc-writer");
const skillPath = path.join(skillRoot, "SKILL.md");

test("raw2d-doc-writer skill has required frontmatter", () => {
  const text = fs.readFileSync(skillPath, "utf8");

  assert.match(text, /^---\nname: raw2d-doc-writer\n/m);
  assert.match(text, /description: Write or update Raw2D documentation/);
  assert.doesNotMatch(text, /\[TODO:/);
});

test("raw2d-doc-writer skill covers Raw2D docs rules", () => {
  const text = fs.readFileSync(skillPath, "utf8");

  assert.match(text, /Hinglish Rules/);
  assert.match(text, /Canvas and WebGL behavior separately/);
  assert.match(text, /npm run build:docs/);
  assert.match(text, /browser page checked/);
});

test("raw2d-doc-writer skill includes Codex UI metadata", () => {
  const agentPath = path.join(skillRoot, "agents", "openai.yaml");
  const text = fs.readFileSync(agentPath, "utf8");

  assert.match(text, /display_name: "Raw2D Doc Writer"/);
  assert.match(text, /default_prompt: "Write docs for this Raw2D feature."/);
});

