import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const skillsRoot = path.join(root, "plugins", "raw2d", "skills");

function skillPath(name) {
  return path.join(skillsRoot, name, "SKILL.md");
}

function readSkill(name) {
  return fs.readFileSync(skillPath(name), "utf8");
}

test("raw2d-doc-writer skill has required frontmatter", () => {
  const text = readSkill("raw2d-doc-writer");

  assert.match(text, /^---\nname: raw2d-doc-writer\n/m);
  assert.match(text, /description: Write or update Raw2D documentation/);
  assert.doesNotMatch(text, /\[TODO:/);
});

test("raw2d-doc-writer skill covers Raw2D docs rules", () => {
  const text = readSkill("raw2d-doc-writer");

  assert.match(text, /Hinglish Rules/);
  assert.match(text, /Canvas and WebGL behavior separately/);
  assert.match(text, /npm run build:docs/);
  assert.match(text, /browser page checked/);
});

test("raw2d-doc-writer skill includes Codex UI metadata", () => {
  const agentPath = path.join(skillsRoot, "raw2d-doc-writer", "agents", "openai.yaml");
  const text = fs.readFileSync(agentPath, "utf8");

  assert.match(text, /display_name: "Raw2D Doc Writer"/);
  assert.match(text, /default_prompt: "Write docs for this Raw2D feature."/);
});

test("raw2d-feature-builder skill has required frontmatter", () => {
  const text = readSkill("raw2d-feature-builder");

  assert.match(text, /^---\nname: raw2d-feature-builder\n/m);
  assert.match(text, /description: Build or modify a Raw2D feature/);
  assert.doesNotMatch(text, /\[TODO:/);
});

test("raw2d-feature-builder skill covers engineering rules", () => {
  const text = readSkill("raw2d-feature-builder");

  assert.match(text, /\*\.type\.ts/);
  assert.match(text, /under 250 lines/);
  assert.match(text, /Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall/);
  assert.match(text, /npm run test:consumer/);
});

test("raw2d-feature-builder skill includes Codex UI metadata", () => {
  const agentPath = path.join(skillsRoot, "raw2d-feature-builder", "agents", "openai.yaml");
  const text = fs.readFileSync(agentPath, "utf8");

  assert.match(text, /display_name: "Raw2D Feature Builder"/);
  assert.match(text, /default_prompt: "Build this Raw2D feature with tests and docs."/);
});

test("raw2d-visual-check skill has required frontmatter", () => {
  const text = readSkill("raw2d-visual-check");

  assert.match(text, /^---\nname: raw2d-visual-check\n/m);
  assert.match(text, /description: Verify Raw2D docs/);
  assert.doesNotMatch(text, /\[TODO:/);
});

test("raw2d-visual-check skill covers browser and pixel checks", () => {
  const text = readSkill("raw2d-visual-check");

  assert.match(text, /node --test tests\/browser-smoke\.test\.mjs/);
  assert.match(text, /tests\/webgl\/visual-regression\.test\.mjs/);
  assert.match(text, /Canvas and WebGL outputs separately/);
  assert.match(text, /route and viewport checked/);
});

test("raw2d-visual-check skill includes Codex UI metadata", () => {
  const agentPath = path.join(skillsRoot, "raw2d-visual-check", "agents", "openai.yaml");
  const text = fs.readFileSync(agentPath, "utf8");

  assert.match(text, /display_name: "Raw2D Visual Check"/);
  assert.match(text, /default_prompt: "Visually check this Raw2D example."/);
});

test("raw2d-package-audit skill has required frontmatter", () => {
  const text = readSkill("raw2d-package-audit");

  assert.match(text, /^---\nname: raw2d-package-audit\n/m);
  assert.match(text, /description: Audit Raw2D workspace packages/);
  assert.doesNotMatch(text, /\[TODO:/);
});

test("raw2d-package-audit skill covers release checks", () => {
  const text = readSkill("raw2d-package-audit");

  assert.match(text, /npm run pack:check -- --silent/);
  assert.match(text, /npm run test:consumer/);
  assert.match(text, /Do not push or publish unless/);
  assert.match(text, /jsDelivr/);
});

test("raw2d-package-audit skill includes Codex UI metadata", () => {
  const agentPath = path.join(skillsRoot, "raw2d-package-audit", "agents", "openai.yaml");
  const text = fs.readFileSync(agentPath, "utf8");

  assert.match(text, /display_name: "Raw2D Package Audit"/);
  assert.match(text, /default_prompt: "Audit Raw2D packages before release."/);
});
