import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importLayersModule() {
  const source = readFileSync("apps/studio/src/StudioLayers.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

function createScene() {
  return {
    version: 1,
    name: "Layers Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 },
      { id: "text-1", type: "text2d", name: "Text 1", x: 120, y: 80, text: "Layer" }
    ]
  };
}

test("Studio layer action selects an object", async () => {
  const module = await importLayersModule();
  const result = module.applyStudioLayerAction({
    scene: createScene(),
    selectedObjectId: undefined,
    objectId: "circle-1",
    action: "select"
  });

  assert.equal(result.handled, true);
  assert.equal(result.selectedObjectId, "circle-1");
});

test("Studio layer action toggles visibility", async () => {
  const module = await importLayersModule();
  const result = module.applyStudioLayerAction({
    scene: createScene(),
    selectedObjectId: "rect-1",
    objectId: "rect-1",
    action: "toggle-visibility"
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].visible, false);
  assert.equal(result.selectedObjectId, "rect-1");
});

test("Studio layer action reorders objects", async () => {
  const module = await importLayersModule();
  const result = module.applyStudioLayerAction({
    scene: createScene(),
    selectedObjectId: "text-1",
    objectId: "text-1",
    action: "move-up"
  });

  assert.equal(result.handled, true);
  assert.deepEqual(
    result.scene.objects.map((object) => object.id),
    ["rect-1", "text-1", "circle-1"]
  );
});
