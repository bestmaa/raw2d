import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importClipboardModules(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-clipboard-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeModule("apps/studio/src/StudioSceneGraph.ts", directory);
  await writeModule("apps/studio/src/StudioSelection.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  await writeModule("apps/studio/src/StudioLineResize.ts", directory);
  await writeModule("apps/studio/src/StudioTextResize.ts", directory);
  await writeModule("apps/studio/src/StudioObjectBounds.ts", directory, {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeModule("apps/studio/src/StudioClipboard.ts", directory, {
    "./StudioClipboardSchema": "./StudioClipboardSchema.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioSelection": "./StudioSelection.js"
  });
  await writeModule("apps/studio/src/StudioClipboardSchema.ts", directory);
  await writeModule("apps/studio/src/StudioCommand.ts", directory, { "./StudioSceneGraph": "./StudioSceneGraph.js" });
  await writeModule("apps/studio/src/StudioClipboardCommands.ts", directory, { "./StudioClipboard": "./StudioClipboard.js" });
  return {
    clipboard: await import(pathToFileURL(join(directory, "StudioClipboard.js")).href),
    commands: await import(pathToFileURL(join(directory, "StudioClipboardCommands.js")).href),
    command: await import(pathToFileURL(join(directory, "StudioCommand.js")).href)
  };
}

async function writeModule(sourcePath, directory, replacements = {}) {
  let output = ts.transpileModule(await readFile(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  for (const [from, to] of Object.entries(replacements)) output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  await writeFile(join(directory, sourcePath.split("/").at(-1).replace(".ts", ".js")), output);
}

function createScene() {
  return {
    version: 1,
    name: "Clipboard Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [{ id: "asset-1", type: "image", name: "Asset", width: 64, height: 64, objectIds: ["sprite-1"] }],
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 40, height: 30 },
      { id: "sprite-1", type: "sprite", name: "Sprite 1", x: 90, y: 40, width: 24, height: 24, assetSlot: "asset-1" },
      {
        id: "group-1",
        type: "group",
        name: "Group 1",
        x: 200,
        y: 150,
        children: [{ id: "child-1", type: "rect", name: "Child 1", x: 8, y: 9, width: 10, height: 12 }]
      }
    ]
  };
}

test("Studio clipboard serializes selected objects in stable JSON", async (t) => {
  const modules = await importClipboardModules(t);
  const text = modules.clipboard.serializeStudioClipboard(createScene(), ["sprite-1", "group-1"]);
  assert.ok(text);

  const payload = JSON.parse(text);
  assert.equal(payload.format, "raw2d-studio-clipboard");
  assert.equal(payload.version, 1);
  assert.deepEqual(payload.objects.map((object) => object.id), ["sprite-1", "group-1"]);
  assert.deepEqual(payload.assets[0].objectIds, ["sprite-1"]);
});

test("Studio clipboard pastes with fresh ids asset refs and undo support", async (t) => {
  const modules = await importClipboardModules(t);
  const scene = createScene();
  const text = modules.clipboard.serializeStudioClipboard(scene, ["sprite-1", "group-1"]);
  const result = modules.commands.createStudioPasteCommand(scene, text);
  assert.ok(result);

  const applied = modules.command.applyStudioCommand({ scene, command: result.command });
  assert.equal(applied.scene.objects.at(-2).id, "sprite-1-paste");
  assert.equal(applied.scene.objects.at(-2).x, 106);
  assert.equal(applied.scene.objects.at(-1).children[0].id, "child-1-paste");
  assert.equal(applied.scene.assets[0].objectIds.includes("sprite-1-paste"), true);

  const inverted = modules.command.applyStudioCommand({ scene: applied.scene, command: modules.command.invertStudioCommand(result.command) });
  assert.deepEqual(inverted.scene.objects, scene.objects);
  assert.deepEqual(inverted.scene.assets, scene.assets);
});

test("Studio clipboard copies nested children at world position", async (t) => {
  const modules = await importClipboardModules(t);
  const text = modules.clipboard.serializeStudioClipboard(createScene(), ["child-1"]);
  const payload = JSON.parse(text);

  assert.equal(payload.objects[0].id, "child-1");
  assert.equal(payload.objects[0].x, 208);
  assert.equal(payload.objects[0].y, 159);
});

test("Studio clipboard rejects malformed payloads", async (t) => {
  const modules = await importClipboardModules(t);
  const scene = createScene();
  assert.equal(modules.clipboard.pasteStudioClipboard(scene, "{nope"), undefined);
  assert.equal(modules.clipboard.pasteStudioClipboard(scene, JSON.stringify({ format: "other", version: 1, objects: [], assets: [] })), undefined);
  assert.equal(modules.clipboard.pasteStudioClipboard(scene, JSON.stringify({
    format: "raw2d-studio-clipboard",
    version: 1,
    objects: [{ id: "bad", type: "rect", name: "Bad", x: 0, y: 0 }],
    assets: []
  })), undefined);
});

test("Studio clipboard remaps conflicting asset ids on paste", async (t) => {
  const modules = await importClipboardModules(t);
  const scene = createScene();
  const foreignPayload = {
    format: "raw2d-studio-clipboard",
    version: 1,
    objects: [{ id: "foreign-sprite", type: "sprite", name: "Foreign", x: 0, y: 0, width: 10, height: 10, assetSlot: "asset-1" }],
    assets: [{ id: "asset-1", type: "image", name: "Foreign Asset", width: 10, height: 10, mimeType: "image/png", objectIds: ["foreign-sprite"] }]
  };
  const result = modules.commands.createStudioPasteCommand(scene, JSON.stringify(foreignPayload));
  assert.ok(result);
  const applied = modules.command.applyStudioCommand({ scene, command: result.command });
  const sprite = applied.scene.objects.at(-1);

  assert.equal(sprite.assetSlot, "asset-1-paste");
  assert.equal(applied.scene.assets.at(-1).id, "asset-1-paste");
  assert.deepEqual(applied.scene.assets.at(-1).objectIds, ["foreign-sprite-paste"]);
});
