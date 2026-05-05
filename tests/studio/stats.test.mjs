import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importStatsModule() {
  const source = readFileSync("apps/studio/src/StudioStats.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

function createStats() {
  return {
    objects: 3,
    drawCalls: 2,
    renderList: { accepted: 3, culled: 0, filtered: 0, hidden: 1, total: 4 },
    batches: 2,
    unsupported: 1,
    vertices: 18,
    textureBinds: 1
  };
}

test("Studio stats panel maps Canvas renderer stats", async () => {
  const module = await importStatsModule();
  const panel = module.createStudioStatsPanel("canvas", createStats());

  assert.equal(panel.renderer, "canvas");
  assert.equal(panel.rows.find((row) => row.label === "Objects")?.value, "3");
  assert.equal(panel.rows.find((row) => row.label === "Draw calls")?.value, "2");
  assert.equal(panel.rows.some((row) => row.label === "Unsupported"), false);
});

test("Studio stats panel maps WebGL diagnostics", async () => {
  const module = await importStatsModule();
  const panel = module.createStudioStatsPanel("webgl", createStats(), "WebGL note");

  assert.equal(panel.note, "WebGL note");
  assert.equal(panel.rows.find((row) => row.label === "Batches")?.value, "2");
  assert.equal(panel.rows.find((row) => row.label === "Unsupported")?.value, "1");
});
