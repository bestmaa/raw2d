import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importCommandFactoryModule() {
  const source = readFileSync("apps/studio/src/StudioCommandFactory.ts", "utf8");
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
    name: "Command Factory Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 70, radius: 30, visible: true }
    ]
  };
}

test("Studio command factory creates object and delete commands", async () => {
  const module = await importCommandFactoryModule();
  const scene = createScene();
  const object = scene.objects[0];

  assert.deepEqual(module.createStudioCreateObjectCommand(object, 0), {
    kind: "create-object",
    object,
    index: 0
  });
  assert.deepEqual(module.createStudioDeleteObjectCommand(scene, "circle-1"), {
    kind: "delete-object",
    objectId: "circle-1",
    object: scene.objects[1],
    index: 1
  });
  assert.equal(module.createStudioDeleteObjectCommand(scene, undefined), undefined);
});

test("Studio command factory creates transform and material commands only when values change", async () => {
  const module = await importCommandFactoryModule();
  const before = createScene().objects[0];
  const after = { ...before, x: 25, width: 120, material: { fillColor: "#ff0000" } };

  assert.deepEqual(module.createStudioTransformCommand(before, after), {
    kind: "update-transform",
    objectId: "rect-1",
    before: { x: 10, y: 20, width: 100, height: 80 },
    after: { x: 25, y: 20, width: 120, height: 80 }
  });
  assert.deepEqual(module.createStudioMaterialCommand(before, after), {
    kind: "update-material",
    objectId: "rect-1",
    before: undefined,
    after: { fillColor: "#ff0000" }
  });
  assert.equal(module.createStudioTransformCommand(before, before), undefined);
  assert.equal(module.createStudioMaterialCommand(before, before), undefined);
});

test("Studio command factory creates text commands only for Text2D changes", async () => {
  const module = await importCommandFactoryModule();
  const before = { id: "text-1", type: "text2d", name: "Text 1", x: 10, y: 20, text: "Layer" };
  const after = { ...before, text: "Headline", font: "20px sans-serif" };

  assert.deepEqual(module.createStudioTextCommand(before, after), {
    kind: "update-text",
    objectId: "text-1",
    before: { text: "Layer", font: undefined },
    after: { text: "Headline", font: "20px sans-serif" }
  });
  assert.equal(module.createStudioTextCommand(before, before), undefined);
  assert.equal(module.createStudioTextCommand(createScene().objects[0], before), undefined);
});

test("Studio command factory includes Text2D font in transform commands", async () => {
  const module = await importCommandFactoryModule();
  const before = { id: "text-1", type: "text2d", name: "Text 1", x: 10, y: 20, text: "Layer" };
  const after = { ...before, y: 34, font: "32px sans-serif" };

  assert.deepEqual(module.createStudioTransformCommand(before, after), {
    kind: "update-transform",
    objectId: "text-1",
    before: { x: 10, y: 20, font: undefined },
    after: { x: 10, y: 34, font: "32px sans-serif" }
  });
});

test("Studio command factory creates visibility and reorder commands", async () => {
  const module = await importCommandFactoryModule();
  const before = createScene();
  const after = { ...before, objects: [before.objects[1], before.objects[0]] };

  assert.deepEqual(module.createStudioVisibilityCommand(before.objects[1], { ...before.objects[1], visible: false }), {
    kind: "set-visibility",
    objectId: "circle-1",
    before: true,
    after: false
  });
  assert.deepEqual(module.createStudioReorderCommand(before, after, "rect-1"), {
    kind: "reorder-object",
    objectId: "rect-1",
    fromIndex: 0,
    toIndex: 1
  });
  assert.equal(module.createStudioVisibilityCommand(before.objects[1], before.objects[1]), undefined);
  assert.equal(module.createStudioReorderCommand(before, before, "rect-1"), undefined);
});

test("Studio command factory creates Sprite asset binding commands", async () => {
  const module = await importCommandFactoryModule();
  const scene = {
    version: 1,
    name: "Sprite Asset Factory",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [{ id: "sprite-1", type: "sprite", name: "Sprite", x: 0, y: 0, width: 64, height: 64, assetSlot: "empty" }]
  };

  assert.deepEqual(module.createStudioSpriteAssetCommand(scene, "sprite-1", "asset-1"), {
    kind: "update-sprite-asset",
    objectId: "sprite-1",
    beforeAssetSlot: "empty",
    afterAssetSlot: "asset-1"
  });
  assert.equal(module.createStudioSpriteAssetCommand(scene, "sprite-1", "empty"), undefined);
  assert.equal(module.createStudioSpriteAssetCommand(scene, "missing", "asset-1"), undefined);
});
