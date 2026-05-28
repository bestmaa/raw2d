import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importArrangementModules(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-arrangement-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeModule("apps/studio/src/StudioLineResize.ts", directory);
  await writeModule("apps/studio/src/StudioTextResize.ts", directory);
  await writeModule("apps/studio/src/StudioSceneGraph.ts", directory);
  await writeModule("apps/studio/src/StudioSelection.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  await writeModule("apps/studio/src/StudioObjectBounds.ts", directory, {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeModule("apps/studio/src/StudioCommandFactory.ts", directory);
  await writeModule("apps/studio/src/StudioCommand.ts", directory, { "./StudioSceneGraph": "./StudioSceneGraph.js" });
  await writeModule("apps/studio/src/StudioArrangement.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioSelection": "./StudioSelection.js"
  });
  await writeModule("apps/studio/src/StudioArrangementCommands.ts", directory, {
    "./StudioArrangement": "./StudioArrangement.js",
    "./StudioCommandFactory": "./StudioCommandFactory.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioSelection": "./StudioSelection.js"
  });

  return {
    commands: await import(pathToFileURL(join(directory, "StudioArrangementCommands.js")).href),
    command: await import(pathToFileURL(join(directory, "StudioCommand.js")).href)
  };
}

async function writeModule(sourcePath, directory, replacements = {}) {
  const source = await readFile(sourcePath, "utf8");
  let output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const [from, to] of Object.entries(replacements)) output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  await writeFile(join(directory, sourcePath.split("/").at(-1).replace(".ts", ".js")), output);
}

function createScene() {
  return {
    version: 1,
    name: "Arrangement Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [{ id: "asset-1", type: "image", name: "Asset", width: 64, height: 64, objectIds: ["sprite-1"] }],
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 13, y: 17, width: 20, height: 10 },
      { id: "rect-2", type: "rect", name: "Rect 2", x: 60, y: 35, width: 30, height: 10 },
      { id: "rect-3", type: "rect", name: "Rect 3", x: 180, y: 65, width: 20, height: 10 },
      { id: "sprite-1", type: "sprite", name: "Sprite 1", x: 210, y: 90, width: 24, height: 24, assetSlot: "asset-1" },
      {
        id: "group-1",
        type: "group",
        name: "Group 1",
        x: 300,
        y: 110,
        children: [{ id: "child-1", type: "rect", name: "Child 1", x: 5, y: 7, width: 12, height: 8 }]
      }
    ]
  };
}

test("Studio duplicate command clones objects and asset refs with undo support", async (t) => {
  const modules = await importArrangementModules(t);
  const scene = createScene();
  const result = modules.commands.createStudioArrangementCommand(scene, ["sprite-1", "group-1"], "duplicate");
  assert.ok(result);

  const applied = modules.command.applyStudioCommand({ scene, command: result.command });
  assert.equal(applied.handled, true);
  assert.deepEqual(result.options.selectedObjectIds, ["sprite-1-copy", "group-1-copy"]);
  assert.equal(applied.scene.assets[0].objectIds.includes("sprite-1-copy"), true);
  assert.equal(applied.scene.objects[4].id, "sprite-1-copy");
  assert.equal(applied.scene.objects[4].x, 226);
  assert.equal(applied.scene.objects[6].children[0].id, "child-1-copy");

  const inverted = modules.command.applyStudioCommand({ scene: applied.scene, command: modules.command.invertStudioCommand(result.command) });
  assert.deepEqual(inverted.scene.objects, scene.objects);
  assert.deepEqual(inverted.scene.assets, scene.assets);
});

test("Studio arrangement commands align distribute and snap through transforms", async (t) => {
  const modules = await importArrangementModules(t);
  let scene = createScene();

  const align = modules.commands.createStudioArrangementCommand(scene, ["rect-1", "rect-2"], "align-left");
  assert.ok(align);
  scene = modules.command.applyStudioCommand({ scene, command: align.command }).scene;
  assert.equal(scene.objects[1].x, 13);

  const distribute = modules.commands.createStudioArrangementCommand(scene, ["rect-1", "rect-2", "rect-3"], "distribute-horizontal");
  assert.ok(distribute);
  scene = modules.command.applyStudioCommand({ scene, command: distribute.command }).scene;
  assert.equal(scene.objects[1].x, 91.5);

  const snap = modules.commands.createStudioArrangementCommand(scene, ["rect-1"], "snap-grid");
  assert.ok(snap);
  scene = modules.command.applyStudioCommand({ scene, command: snap.command }).scene;
  assert.equal(scene.objects[0].x, 10);
  assert.equal(scene.objects[0].y, 20);
});
