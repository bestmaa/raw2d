import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importLayersModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-layers-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeTranspiledModule("apps/studio/src/StudioLineResize.ts", join(directory, "StudioLineResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioTextResize.ts", join(directory, "StudioTextResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioSceneGraph.ts", join(directory, "StudioSceneGraph.js"));
  await writeTranspiledModule("apps/studio/src/StudioObjectBounds.ts", join(directory, "StudioObjectBounds.js"), {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioSelection.ts", join(directory, "StudioSelection.js"), {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioLayers.ts", join(directory, "StudioLayers.js"), {
    "./StudioSelection": "./StudioSelection.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });

  return import(pathToFileURL(join(directory, "StudioLayers.js")).href);
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

test("Studio layer action selects an object", async (t) => {
  const module = await importLayersModule(t);
  const result = module.applyStudioLayerAction({
    scene: createScene(),
    selectedObjectId: undefined,
    objectId: "circle-1",
    action: "select"
  });

  assert.equal(result.handled, true);
  assert.equal(result.selectedObjectId, "circle-1");
});

test("Studio layer action shift-selects multiple objects", async (t) => {
  const module = await importLayersModule(t);
  const result = module.applyStudioLayerAction({
    scene: createScene(),
    selectedObjectIds: ["rect-1"],
    objectId: "circle-1",
    action: "select",
    additiveSelection: true
  });

  assert.equal(result.handled, true);
  assert.deepEqual(result.selectedObjectIds, ["rect-1", "circle-1"]);
  assert.equal(result.selectedObjectId, "circle-1");
});

test("Studio layer action toggles visibility", async (t) => {
  const module = await importLayersModule(t);
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

test("Studio layer action reorders objects", async (t) => {
  const module = await importLayersModule(t);
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
