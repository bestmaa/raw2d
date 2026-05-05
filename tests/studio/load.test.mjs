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
  assert.equal(scene.objects[0].width, 120);
  assert.equal(scene.objects[1].text, "Loaded");
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
