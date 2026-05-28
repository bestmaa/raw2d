import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importCommandModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-command-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeTranspiledModule("apps/studio/src/StudioSceneGraph.ts", join(directory, "StudioSceneGraph.js"));
  await writeTranspiledModule("apps/studio/src/StudioCommand.ts", join(directory, "StudioCommand.js"), {
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  return import(pathToFileURL(join(directory, "StudioCommand.js")).href);
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
    name: "Command Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 70, radius: 30 },
      { id: "text-1", type: "text2d", name: "Text 1", x: 120, y: 80, text: "Layer" }
    ]
  };
}

test("Studio create command applies and inverts", async (t) => {
  const module = await importCommandModule(t);
  const object = { id: "sprite-1", type: "sprite", name: "Sprite 1", x: 200, y: 120, width: 64, height: 64, assetSlot: "empty" };
  const command = { kind: "create-object", object, index: 1 };
  const created = module.applyStudioCommand({ scene: createScene(), command });

  assert.equal(created.handled, true);
  assert.deepEqual(created.scene.objects.map((candidate) => candidate.id), ["rect-1", "sprite-1", "circle-1", "text-1"]);

  const reverted = module.applyStudioCommand({ scene: created.scene, command: module.invertStudioCommand(command) });

  assert.equal(reverted.handled, true);
  assert.deepEqual(reverted.scene.objects.map((candidate) => candidate.id), ["rect-1", "circle-1", "text-1"]);
});

test("Studio delete command applies and restores original index", async (t) => {
  const module = await importCommandModule(t);
  const scene = createScene();
  const command = { kind: "delete-object", objectId: "circle-1", object: scene.objects[1], index: 1 };
  const deleted = module.applyStudioCommand({ scene, command });

  assert.equal(deleted.handled, true);
  assert.deepEqual(deleted.scene.objects.map((object) => object.id), ["rect-1", "text-1"]);

  const restored = module.applyStudioCommand({ scene: deleted.scene, command: module.invertStudioCommand(command) });

  assert.equal(restored.handled, true);
  assert.deepEqual(restored.scene.objects.map((object) => object.id), ["rect-1", "circle-1", "text-1"]);
});

test("Studio batch command applies and inverts grouped edits", async (t) => {
  const module = await importCommandModule(t);
  const command = {
    kind: "batch",
    commands: [
      {
        kind: "update-transform",
        objectId: "rect-1",
        before: { x: 10, y: 20, width: 100, height: 80 },
        after: { x: 30, y: 24, width: 100, height: 80 }
      },
      {
        kind: "update-transform",
        objectId: "circle-1",
        before: { x: 60, y: 70, radius: 30 },
        after: { x: 80, y: 74, radius: 30 }
      }
    ]
  };
  const updated = module.applyStudioCommand({ scene: createScene(), command });

  assert.equal(updated.handled, true);
  assert.equal(updated.scene.objects[0].x, 30);
  assert.equal(updated.scene.objects[1].x, 80);

  const reverted = module.applyStudioCommand({ scene: updated.scene, command: module.invertStudioCommand(command) });

  assert.equal(reverted.scene.objects[0].x, 10);
  assert.equal(reverted.scene.objects[1].x, 60);
});

test("Studio transform command applies and inverts object geometry", async (t) => {
  const module = await importCommandModule(t);
  const command = {
    kind: "update-transform",
    objectId: "rect-1",
    before: { x: 10, y: 20, width: 100, height: 80 },
    after: { x: 30, y: 40, width: 140, height: 90 }
  };
  const updated = module.applyStudioCommand({ scene: createScene(), command });

  assert.equal(updated.handled, true);
  assert.equal(updated.scene.objects[0].x, 30);
  assert.equal(updated.scene.objects[0].width, 140);

  const reverted = module.applyStudioCommand({ scene: updated.scene, command: module.invertStudioCommand(command) });

  assert.equal(reverted.scene.objects[0].x, 10);
  assert.equal(reverted.scene.objects[0].width, 100);
});

test("Studio transform command applies and inverts Text2D font scale", async (t) => {
  const module = await importCommandModule(t);
  const command = {
    kind: "update-transform",
    objectId: "text-1",
    before: { x: 120, y: 80, font: undefined },
    after: { x: 120, y: 92, font: "36px sans-serif" }
  };
  const updated = module.applyStudioCommand({ scene: createScene(), command });

  assert.equal(updated.handled, true);
  assert.equal(updated.scene.objects[2].y, 92);
  assert.equal(updated.scene.objects[2].font, "36px sans-serif");

  const reverted = module.applyStudioCommand({ scene: updated.scene, command: module.invertStudioCommand(command) });

  assert.equal(reverted.scene.objects[2].y, 80);
  assert.equal(reverted.scene.objects[2].font, undefined);
});

test("Studio material and visibility commands apply and invert", async (t) => {
  const module = await importCommandModule(t);
  const materialCommand = {
    kind: "update-material",
    objectId: "rect-1",
    before: undefined,
    after: { fillColor: "#35c2ff", strokeColor: "#ffffff", lineWidth: 2 }
  };
  const visibilityCommand = { kind: "set-visibility", objectId: "rect-1", before: undefined, after: false };
  const material = module.applyStudioCommand({ scene: createScene(), command: materialCommand });
  const hidden = module.applyStudioCommand({ scene: material.scene, command: visibilityCommand });

  assert.equal(hidden.scene.objects[0].material.fillColor, "#35c2ff");
  assert.equal(hidden.scene.objects[0].visible, false);

  const visible = module.applyStudioCommand({ scene: hidden.scene, command: module.invertStudioCommand(visibilityCommand) });
  const reverted = module.applyStudioCommand({ scene: visible.scene, command: module.invertStudioCommand(materialCommand) });

  assert.equal(visible.scene.objects[0].visible, undefined);
  assert.equal(reverted.scene.objects[0].material, undefined);
});

test("Studio text command applies and inverts text content", async (t) => {
  const module = await importCommandModule(t);
  const command = {
    kind: "update-text",
    objectId: "text-1",
    before: { text: "Layer", font: undefined },
    after: { text: "Headline", font: "20px sans-serif" }
  };
  const updated = module.applyStudioCommand({ scene: createScene(), command });

  assert.equal(updated.handled, true);
  assert.equal(updated.scene.objects[2].text, "Headline");
  assert.equal(updated.scene.objects[2].font, "20px sans-serif");

  const reverted = module.applyStudioCommand({ scene: updated.scene, command: module.invertStudioCommand(command) });

  assert.equal(reverted.scene.objects[2].text, "Layer");
  assert.equal(reverted.scene.objects[2].font, undefined);
});

test("Studio reorder command applies and inverts layer order", async (t) => {
  const module = await importCommandModule(t);
  const command = { kind: "reorder-object", objectId: "text-1", fromIndex: 2, toIndex: 0 };
  const reordered = module.applyStudioCommand({ scene: createScene(), command });

  assert.equal(reordered.handled, true);
  assert.deepEqual(reordered.scene.objects.map((object) => object.id), ["text-1", "rect-1", "circle-1"]);

  const restored = module.applyStudioCommand({ scene: reordered.scene, command: module.invertStudioCommand(command) });

  assert.deepEqual(restored.scene.objects.map((object) => object.id), ["rect-1", "circle-1", "text-1"]);
});

test("Studio sprite asset command applies and inverts asset references", async (t) => {
  const module = await importCommandModule(t);
  const scene = {
    version: 1,
    name: "Sprite Asset Command",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [{ id: "asset-1", type: "image", name: "Hero", width: 64, height: 64, objectIds: [] }],
    objects: [{ id: "sprite-1", type: "sprite", name: "Sprite", x: 0, y: 0, width: 64, height: 64, assetSlot: "empty" }]
  };
  const command = { kind: "update-sprite-asset", objectId: "sprite-1", beforeAssetSlot: "empty", afterAssetSlot: "asset-1" };
  const updated = module.applyStudioCommand({ scene, command });

  assert.equal(updated.handled, true);
  assert.equal(updated.scene.objects[0].assetSlot, "asset-1");
  assert.deepEqual(updated.scene.assets[0].objectIds, ["sprite-1"]);

  const reverted = module.applyStudioCommand({ scene: updated.scene, command: module.invertStudioCommand(command) });

  assert.equal(reverted.scene.objects[0].assetSlot, "empty");
  assert.deepEqual(reverted.scene.assets[0].objectIds, []);
});
