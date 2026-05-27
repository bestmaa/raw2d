import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importLoadModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-load-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeTranspiledModule("apps/studio/src/StudioSceneDiagnostics.ts", join(directory, "StudioSceneDiagnostics.js"));
  await writeTranspiledModule("apps/studio/src/StudioMcpImport.ts", join(directory, "StudioMcpImport.js"), {
    "./StudioSceneDiagnostics": "./StudioSceneDiagnostics.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioLoad.ts", join(directory, "StudioLoad.js"), {
    "./StudioMcpImport": "./StudioMcpImport.js",
    "./StudioSceneDiagnostics": "./StudioSceneDiagnostics.js"
  });

  return import(pathToFileURL(join(directory, "StudioLoad.js")).href);
}

async function writeTranspiledModule(sourcePath, outputPath, replacements = {}) {
  const source = await readFile(sourcePath, "utf8");
  let output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;

  for (const [from, to] of Object.entries(replacements)) {
    output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  }

  await writeFile(outputPath, output);
}

test("Studio load deserializes saved scene JSON", async (t) => {
  const module = await importLoadModule(t);
  const scene = module.deserializeStudioScene(`{
    "version": 1,
    "name": "Loaded Scene",
    "rendererMode": "webgl",
    "camera": { "x": 4, "y": 8, "zoom": 2 },
    "objects": [
      { "id": "rect-1", "type": "rect", "name": "Card", "x": 10, "y": 20, "width": 120, "height": 80 },
      { "id": "text-1", "type": "text2d", "name": "Label", "x": 20, "y": 42, "text": "Loaded", "font": "24px sans-serif" }
    ]
  }`);

  assert.equal(scene.name, "Loaded Scene");
  assert.equal(scene.rendererMode, "webgl");
  assert.deepEqual(scene.camera, { x: 4, y: 8, zoom: 2 });
  assert.deepEqual(scene.assets, []);
  assert.equal(scene.objects[0].width, 120);
  assert.equal(scene.objects[1].text, "Loaded");
});

test("Studio load deserializes saved asset metadata", async (t) => {
  const module = await importLoadModule(t);
  const result = module.deserializeStudioSceneWithDiagnostics(`{
    "version": 1,
    "name": "Loaded Assets",
    "rendererMode": "canvas",
    "camera": { "x": 0, "y": 0, "zoom": 1 },
    "assets": [
      { "id": "asset-1", "type": "image", "name": "Hero", "width": 64, "height": 64, "mimeType": "image/png", "objectIds": ["sprite-1"] }
    ],
    "objects": [
      { "id": "sprite-1", "type": "sprite", "name": "Sprite", "x": 0, "y": 0, "width": 64, "height": 64, "assetSlot": "asset-1" }
    ]
  }`);

  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.scene.assets[0], {
    id: "asset-1",
    type: "image",
    name: "Hero",
    width: 64,
    height: 64,
    mimeType: "image/png",
    objectIds: ["sprite-1"]
  });
});

test("Studio load reports missing asset references as diagnostics", async (t) => {
  const module = await importLoadModule(t);
  const result = module.deserializeStudioSceneWithDiagnostics(`{
    "version": 1,
    "name": "Missing Assets",
    "rendererMode": "canvas",
    "camera": { "x": 0, "y": 0, "zoom": 1 },
    "assets": [
      { "id": "asset-1", "type": "image", "name": "Hero", "width": 64, "height": 64, "objectIds": ["missing-object"] }
    ],
    "objects": [
      { "id": "sprite-1", "type": "sprite", "name": "Sprite", "x": 0, "y": 0, "width": 64, "height": 64, "assetSlot": "missing-asset" }
    ]
  }`);

  assert.deepEqual(result.warnings, [
    "Sprite sprite-1 references missing asset missing-asset.",
    "Asset asset-1 references missing object missing-object."
  ]);
});

test("Studio load imports valid Raw2D MCP scene JSON", async (t) => {
  const module = await importLoadModule(t);
  const result = module.deserializeStudioSceneWithDiagnostics(`{
    "scene": {
      "objects": [
        { "id": "card", "type": "rect", "x": 10, "y": 20, "width": 120, "height": 80, "material": { "fillColor": "#35c2ff" } },
        { "id": "label", "type": "text2d", "x": 16, "y": 32, "text": "MCP", "font": "24px sans-serif" }
      ]
    },
    "camera": { "x": 4, "y": 8, "zoom": 2 }
  }`);

  assert.equal(result.scene.name, "Imported MCP Scene");
  assert.equal(result.scene.rendererMode, "canvas");
  assert.deepEqual(result.scene.camera, { x: 4, y: 8, zoom: 2 });
  assert.deepEqual(result.warnings, []);
  assert.equal(result.scene.objects[0].id, "card");
  assert.equal(result.scene.objects[0].name, "Rect card");
  assert.equal(result.scene.objects[1].id, "label");
  assert.equal(result.scene.objects[1].text, "MCP");
});

test("Studio load imports duplicate Raw2D MCP ids deterministically", async (t) => {
  const module = await importLoadModule(t);
  const result = module.deserializeStudioSceneWithDiagnostics(`{
    "scene": {
      "objects": [
        { "id": "shape", "type": "rect", "width": 120, "height": 80 },
        { "id": "shape", "type": "circle", "radius": 24 },
        { "id": "shape", "type": "line", "startX": 0, "startY": 0, "endX": 20, "endY": 20 }
      ]
    },
    "camera": { "x": 0, "y": 0, "zoom": 1 }
  }`);

  assert.deepEqual(result.scene.objects.map((object) => object.id), ["shape", "shape-2", "shape-3"]);
  assert.deepEqual(result.warnings, [
    "Raw2D MCP object id shape was duplicated; using shape-2.",
    "Raw2D MCP object id shape was duplicated; using shape-3."
  ]);
});

test("Studio load imports invalid Raw2D MCP ids deterministically", async (t) => {
  const module = await importLoadModule(t);
  const result = module.deserializeStudioSceneWithDiagnostics(`{
    "scene": {
      "objects": [
        { "id": "", "type": "rect", "width": 120, "height": 80 },
        { "id": "bad id", "type": "circle", "radius": 24 },
        { "type": "text2d", "text": "Missing id" }
      ]
    },
    "camera": { "x": 0, "y": 0, "zoom": 1 }
  }`);

  assert.deepEqual(result.scene.objects.map((object) => object.id), ["mcp-rect-1", "mcp-circle-2", "mcp-text2d-3"]);
  assert.deepEqual(result.warnings, [
    "Raw2D MCP object at index 0 had invalid id; using mcp-rect-1.",
    "Raw2D MCP object at index 1 had invalid id; using mcp-circle-2.",
    "Raw2D MCP object at index 2 had invalid id; using mcp-text2d-3."
  ]);
});

test("Studio load rejects unsupported object types", async (t) => {
  const module = await importLoadModule(t);

  assert.throws(
    () =>
      module.deserializeStudioScene(`{
        "version": 1,
        "name": "Bad Scene",
        "rendererMode": "canvas",
        "camera": { "x": 0, "y": 0, "zoom": 1 },
        "objects": [{ "id": "bad-1", "type": "mesh", "name": "Bad", "x": 0, "y": 0 }]
      }`),
    /Unsupported Studio object type "mesh" for object bad-1/
  );
});

test("Studio load rejects invalid geometry with explicit messages", async (t) => {
  const module = await importLoadModule(t);

  assert.throws(
    () =>
      module.deserializeStudioScene(`{
        "version": 1,
        "name": "Bad Rect",
        "rendererMode": "canvas",
        "camera": { "x": 0, "y": 0, "zoom": 1 },
        "objects": [{ "id": "rect-1", "type": "rect", "name": "Bad", "x": 0, "y": 0, "width": 0, "height": 10 }]
      }`),
    /Invalid Studio rect geometry rect-1: width must be greater than 0/
  );

  assert.throws(
    () =>
      module.deserializeStudioScene(`{
        "version": 1,
        "name": "Bad Line",
        "rendererMode": "canvas",
        "camera": { "x": 0, "y": 0, "zoom": 1 },
        "objects": [{ "id": "line-1", "type": "line", "name": "Bad", "x": 0, "y": 0, "startX": 2, "startY": 4, "endX": 2, "endY": 4 }]
      }`),
    /Invalid Studio line geometry line-1: start and end points must be different/
  );
});

test("Studio load reports malformed JSON", async (t) => {
  const module = await importLoadModule(t);

  assert.throws(() => module.deserializeStudioScene("{"), /Expected property name|JSON/);
});

test("Studio load reports missing required schema fields", async (t) => {
  const module = await importLoadModule(t);

  assert.throws(
    () =>
      module.deserializeStudioScene(`{
        "version": 1,
        "name": "Missing Camera",
        "rendererMode": "canvas",
        "objects": []
      }`),
    /Studio scene JSON must contain an object/
  );
});
