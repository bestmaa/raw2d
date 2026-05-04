import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importSceneStateModule() {
  const source = readFileSync("apps/studio/src/StudioSceneState.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio scene state starts empty with default camera", async () => {
  const module = await importSceneStateModule();
  const scene = module.createStudioSceneState();

  assert.equal(scene.version, 1);
  assert.equal(scene.name, "Untitled Scene");
  assert.equal(scene.rendererMode, "canvas");
  assert.deepEqual(scene.camera, { x: 0, y: 0, zoom: 1 });
  assert.deepEqual(scene.objects, []);
});

test("Studio sample scene includes visible starter objects", async () => {
  const module = await importSceneStateModule();
  const scene = module.createStudioSampleSceneState();

  assert.equal(scene.name, "Sample Scene");
  assert.equal(scene.objects.length, 3);
  assert.deepEqual(
    scene.objects.map((object) => object.type),
    ["rect", "circle", "text2d"]
  );
});
