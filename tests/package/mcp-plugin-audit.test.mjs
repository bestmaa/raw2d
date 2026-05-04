import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageDirs = ["canvas", "core", "effects", "interaction", "mcp", "raw2d", "react", "sprite", "text", "webgl"];

test("raw2d-mcp package stays focused on MCP and core data", async () => {
  const manifest = await readJson("packages/mcp/package.json");
  const dependencies = Object.keys(manifest.dependencies ?? {});

  assert.equal(manifest.bin["raw2d-mcp"], "./dist/server.js");
  assert.deepEqual(dependencies, ["raw2d-core"]);
  assert.doesNotMatch(JSON.stringify(manifest), /raw2d-canvas|raw2d-webgl|raw2d-react/);
});

test("publishable packages do not include repo plugin or agent files", async () => {
  for (const dir of packageDirs) {
    const manifest = await readJson(`packages/${dir}/package.json`);
    const packedFiles = manifest.files.join("\n");

    assert.doesNotMatch(packedFiles, /plugins/);
    assert.doesNotMatch(packedFiles, /AGENTS\.md/);
    assert.deepEqual(manifest.files, ["dist", "README.md", "LICENSE", "NOTICE", "TRADEMARKS.md"]);
  }
});

test("repo plugin metadata exposes audit and example commands without package publishing", async () => {
  const plugin = await readJson("plugins/raw2d/.codex-plugin/plugin.json");
  const readme = await readFile("plugins/raw2d/README.md", "utf8");

  assert.equal(plugin.name, "raw2d");
  assert.match(readme, /create-raw2d-showcase/);
  assert.match(readme, /run-fresh-install-audit/);
  assert.match(readme, /Do not publish npm packages/);
  assert.match(readme, /Do not push Git/);
});

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
