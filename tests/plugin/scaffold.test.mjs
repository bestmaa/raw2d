import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const pluginRoot = path.join(root, "plugins", "raw2d");
const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("Raw2D Codex plugin scaffold stays outside runtime packages", () => {
  assert.ok(fs.existsSync(manifestPath));
  assert.ok(!pluginRoot.includes(`${path.sep}packages${path.sep}`));
});

test("Raw2D Codex plugin manifest has stable metadata", () => {
  const manifest = readJson(manifestPath);

  assert.equal(manifest.name, "raw2d");
  assert.equal(manifest.license, "Apache-2.0");
  assert.equal(manifest.skills, "./skills/");
  assert.equal(manifest.mcpServers, "./.mcp.json");
  assert.equal(manifest.interface.displayName, "Raw2D");
  assert.ok(manifest.interface.capabilities.includes("MCP"));
});

test("Raw2D Codex plugin folders are documented", () => {
  for (const folder of ["assets", "scripts", "skills"]) {
    assert.ok(fs.existsSync(path.join(pluginRoot, folder, "README.md")));
  }
});

