import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importLoadModule() {
  const source = readFileSync("apps/studio/src/StudioLoad.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio load deserializes saved scene JSON", async () => {
  const module = await importLoadModule();
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

test("Studio load deserializes saved asset metadata", async () => {
  const module = await importLoadModule();
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

test("Studio load reports missing asset references as diagnostics", async () => {
  const module = await importLoadModule();
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

test("Studio load rejects unsupported object types", async () => {
  const module = await importLoadModule();

  assert.throws(
    () =>
      module.deserializeStudioScene(`{
        "version": 1,
        "name": "Bad Scene",
        "rendererMode": "canvas",
        "camera": { "x": 0, "y": 0, "zoom": 1 },
        "objects": [{ "id": "bad-1", "type": "mesh", "name": "Bad", "x": 0, "y": 0 }]
      }`),
    /Unsupported Studio object type/
  );
});

test("Studio load reports malformed JSON", async () => {
  const module = await importLoadModule();

  assert.throws(() => module.deserializeStudioScene("{"), /Expected property name|JSON/);
});

test("Studio load reports missing required schema fields", async () => {
  const module = await importLoadModule();

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
