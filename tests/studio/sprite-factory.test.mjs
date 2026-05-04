import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importFactoryModule() {
  const source = readFileSync("apps/studio/src/StudioObjectFactory.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio Sprite tool factory appends a placeholder Sprite object", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Tool Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: []
  };
  const nextScene = module.addStudioSpriteObject({ scene });

  assert.equal(nextScene.objects.length, 1);
  assert.deepEqual(nextScene.objects[0], {
    id: "sprite-1",
    type: "sprite",
    name: "Sprite 1",
    x: 280,
    y: 140,
    width: 128,
    height: 128,
    assetSlot: "empty",
    material: {
      fillColor: "#1f2937",
      strokeColor: "#35c2ff",
      lineWidth: 2
    }
  });
});

test("Studio Sprite tool factory offsets repeated Sprite placeholders", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Tool Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [{ id: "sprite-1", type: "sprite", name: "Sprite 1", x: 280, y: 140, width: 128, height: 128, assetSlot: "empty" }]
  };
  const nextScene = module.addStudioSpriteObject({ scene });
  const sprite = nextScene.objects[1];

  assert.equal(sprite.id, "sprite-2");
  assert.equal(sprite.x, 304);
  assert.equal(sprite.y, 164);
});
