import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importGroupingModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-grouping-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeTranspiledModule("apps/studio/src/StudioLineResize.ts", join(directory, "StudioLineResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioTextResize.ts", join(directory, "StudioTextResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioSceneGraph.ts", join(directory, "StudioSceneGraph.js"));
  await writeTranspiledModule("apps/studio/src/StudioObjectBounds.ts", join(directory, "StudioObjectBounds.js"), {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioGrouping.ts", join(directory, "StudioGrouping.js"), {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  return import(pathToFileURL(join(directory, "StudioGrouping.js")).href);
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
    name: "Grouping Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 100, y: 80, width: 80, height: 50 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 240, y: 160, radius: 30 },
      { id: "text-1", type: "text2d", name: "Text 1", x: 320, y: 200, text: "Loose" }
    ]
  };
}

test("Studio groups selected root objects without hiding children", async (t) => {
  const module = await importGroupingModule(t);
  const result = module.groupStudioObjects(createScene(), ["rect-1", "circle-1"]);

  assert.ok(result);
  assert.deepEqual(result.scene.objects.map((object) => object.id), ["group-1", "text-1"]);
  assert.equal(result.scene.objects[0].type, "group");
  assert.deepEqual(result.scene.objects[0].children.map((object) => object.id), ["rect-1", "circle-1"]);
  assert.equal(result.scene.objects[0].children[0].x, 0);
  assert.equal(result.scene.objects[0].children[1].x, 140);
});

test("Studio ungroups a root group and restores child world positions", async (t) => {
  const module = await importGroupingModule(t);
  const grouped = module.groupStudioObjects(createScene(), ["rect-1", "circle-1"]);
  const ungrouped = module.ungroupStudioObject(grouped.scene, grouped.groupId);

  assert.ok(ungrouped);
  assert.deepEqual(ungrouped.scene.objects.map((object) => object.id), ["rect-1", "circle-1", "text-1"]);
  assert.equal(ungrouped.scene.objects[0].x, 100);
  assert.equal(ungrouped.scene.objects[1].x, 240);
  assert.deepEqual(ungrouped.childIds, ["rect-1", "circle-1"]);
});

test("Studio ungroups a nested group inside its parent", async (t) => {
  const module = await importGroupingModule(t);
  const scene = {
    ...createScene(),
    objects: [
      {
        id: "outer",
        type: "group",
        name: "Outer",
        x: 50,
        y: 60,
        children: [
          {
            id: "inner",
            type: "group",
            name: "Inner",
            x: 10,
            y: 20,
            children: [{ id: "rect-1", type: "rect", name: "Rect 1", x: 5, y: 6, width: 20, height: 10 }]
          }
        ]
      }
    ]
  };
  const ungrouped = module.ungroupStudioObject(scene, "inner");

  assert.ok(ungrouped);
  assert.equal(ungrouped.scene.objects[0].type, "group");
  assert.deepEqual(ungrouped.scene.objects[0].children.map((object) => object.id), ["rect-1"]);
  assert.equal(ungrouped.scene.objects[0].children[0].x, 15);
  assert.equal(ungrouped.scene.objects[0].children[0].y, 26);
  assert.deepEqual(ungrouped.childIds, ["rect-1"]);
});
