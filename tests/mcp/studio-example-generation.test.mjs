import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  generateRaw2DStudioExample,
  validateRaw2DStudioScene
} from "../../packages/mcp/dist/index.js";
import { dispatchRaw2DMcpTool } from "../../packages/mcp/dist/dispatchRaw2DMcpTool.js";

test("generateRaw2DStudioExample creates Studio JSON that round-trips through save load and render adapter", async (t) => {
  const modules = await importStudioModules(t);
  const example = generateRaw2DStudioExample({
    document: createMcpScene(),
    name: "MCP Studio Hero",
    rendererMode: "webgl"
  });

  assert.equal(example.renderer, "studio");
  assert.equal(example.filename, "mcp-studio-hero.raw2d.json");
  assert.deepEqual(JSON.parse(example.json), example.document);
  assert.equal(example.validation.valid, true);
  assert.deepEqual(
    example.validation.warnings.map((warning) => warning.path),
    ["$.rendererMode", "$.objects[1]", "$.objects[2]"]
  );

  const loadResult = modules.load.deserializeStudioSceneWithDiagnostics(example.json);
  const saved = modules.save.serializeStudioScene(loadResult.scene);
  const reloaded = modules.load.deserializeStudioScene(saved);
  const runtime = modules.render.createRuntimeSceneFromStudioState(reloaded, {
    imageFactory: () => ({ width: 48, height: 48 })
  });
  const validation = validateRaw2DStudioScene({ document: modules.save.createStudioSceneSaveDocument(reloaded) });

  assert.deepEqual(loadResult.warnings, []);
  assert.equal(reloaded.name, "MCP Studio Hero");
  assert.equal(reloaded.assets[0]?.objectIds[0], "logo");
  assert.equal(runtime.scene.getObjects().length, 3);
  assert.equal(runtime.objects[2].name, "Sprite logo");
  assert.equal(runtime.objects[2].width, 48);
  assert.equal(validation.valid, true);
});

test("Studio example generator dispatch exposes the MCP tool", () => {
  const result = dispatchRaw2DMcpTool("raw2d_generate_studio_example", {
    document: createMcpScene(),
    name: "Dispatch Studio"
  });

  assert.equal(result.scene.name, "Dispatch Studio");
  assert.equal(result.validation.valid, true);
});

function createMcpScene() {
  const withRect = addRaw2DSceneObject({
    document: createRaw2DSceneJson({ camera: { x: 4, y: 8, zoom: 1.5 } }),
    object: { type: "rect", id: "card", x: 80, y: 64, width: 160, height: 96, material: { fillColor: "#35c2ff" } }
  });
  const withText = addRaw2DSceneObject({
    document: withRect,
    object: { type: "text2d", id: "label", x: 96, y: 120, text: "Studio", font: "24px sans-serif" }
  });

  return addRaw2DSceneObject({
    document: withText,
    object: { type: "sprite", id: "logo", textureId: "hero-texture", x: 260, y: 72, width: 48, height: 48 }
  });
}

async function importStudioModules(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-example-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeTranspiledModule("apps/studio/src/StudioSceneDiagnostics.ts", join(directory, "StudioSceneDiagnostics.js"));
  await writeTranspiledModule("apps/studio/src/StudioMcpImport.ts", join(directory, "StudioMcpImport.js"), {
    "./StudioSceneDiagnostics": "./StudioSceneDiagnostics.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioLoad.ts", join(directory, "StudioLoad.js"), {
    "./StudioMcpImport": "./StudioMcpImport.js",
    "./StudioSceneDiagnostics": "./StudioSceneDiagnostics.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioSave.ts", join(directory, "StudioSave.js"));
  await writeTranspiledModule("apps/studio/src/StudioRenderAdapter.ts", join(directory, "StudioRenderAdapter.js"), {
    raw2d: pathToFileURL(`${process.cwd()}/packages/raw2d/dist/raw2d.js`).href
  });

  return {
    load: await import(pathToFileURL(join(directory, "StudioLoad.js")).href),
    render: await import(pathToFileURL(join(directory, "StudioRenderAdapter.js")).href),
    save: await import(pathToFileURL(join(directory, "StudioSave.js")).href)
  };
}

async function writeTranspiledModule(sourcePath, outputPath, replacements = {}) {
  const source = await readFile(sourcePath, "utf8");
  let output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;

  for (const [from, to] of Object.entries(replacements)) {
    output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  }

  await writeFile(outputPath, output);
}
