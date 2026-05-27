import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importAssetsModule() {
  const source = readFileSync("apps/studio/src/StudioAssets.ts", "utf8");
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
    name: "Asset Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [
      {
        id: "sprite-1",
        type: "sprite",
        name: "Sprite 1",
        x: 10,
        y: 20,
        width: 128,
        height: 128,
        assetSlot: "empty"
      }
    ]
  };
}

test("Studio asset state adds image assets with stable ids and dimensions", async () => {
  const module = await importAssetsModule();
  const scene = createScene();
  const nextScene = module.addStudioImageAsset({
    scene,
    asset: { name: " Hero Image ", width: 320, height: 180, objectIds: ["sprite-1"] }
  });

  assert.equal(scene.assets.length, 0);
  assert.deepEqual(nextScene.assets[0], {
    id: "asset-1",
    type: "image",
    name: "Hero Image",
    width: 320,
    height: 180,
    objectIds: ["sprite-1"]
  });
});

test("Studio asset state removes image assets immutably", async () => {
  const module = await importAssetsModule();
  const scene = module.addStudioImageAsset({
    scene: createScene(),
    asset: { id: "hero", name: "Hero", width: 64, height: 64 }
  });
  const nextScene = module.removeStudioAsset({ scene, assetId: "hero" });

  assert.equal(scene.assets.length, 1);
  assert.deepEqual(nextScene.assets, []);
});

test("Studio asset state looks up assets and referenced objects", async () => {
  const module = await importAssetsModule();
  const scene = module.addStudioImageAsset({
    scene: createScene(),
    asset: { id: "hero", name: "Hero", width: 64, height: 64, objectIds: ["sprite-1"] }
  });

  assert.equal(module.getStudioAssetById({ scene, assetId: "hero" })?.name, "Hero");
  assert.deepEqual(
    module.getStudioAssetObjects({ scene, assetId: "hero" }).map((object) => object.id),
    ["sprite-1"]
  );
  assert.deepEqual(
    module.getStudioAssetsForObject(scene, "sprite-1").map((asset) => asset.id),
    ["hero"]
  );
});

test("Studio asset state can add and remove object references", async () => {
  const module = await importAssetsModule();
  const scene = module.addStudioImageAsset({
    scene: createScene(),
    asset: { id: "hero", name: "Hero", width: 64, height: 64 }
  });
  const referenced = module.addStudioAssetObjectReference({ scene, assetId: "hero", objectId: "sprite-1" });
  const unreferenced = module.removeStudioAssetObjectReference({ scene: referenced, assetId: "hero", objectId: "sprite-1" });

  assert.deepEqual(referenced.assets[0].objectIds, ["sprite-1"]);
  assert.deepEqual(unreferenced.assets[0].objectIds, []);
});

test("Studio asset state rejects invalid image metadata and missing object references", async () => {
  const module = await importAssetsModule();
  const scene = createScene();

  assert.throws(
    () => module.addStudioImageAsset({ scene, asset: { name: " ", width: 64, height: 64 } }),
    /name must not be empty/
  );
  assert.throws(
    () => module.addStudioImageAsset({ scene, asset: { name: "Hero", width: 0, height: 64 } }),
    /width must be a positive number/
  );
  assert.throws(
    () => module.addStudioImageAsset({ scene, asset: { name: "Hero", width: 64, height: 64, objectIds: ["missing"] } }),
    /object reference was not found/
  );
});
