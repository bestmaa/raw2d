import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importKeyboardModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-keyboard-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeTranspiledModule("apps/studio/src/StudioLineResize.ts", join(directory, "StudioLineResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioTextResize.ts", join(directory, "StudioTextResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioObjectBounds.ts", join(directory, "StudioObjectBounds.js"), {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioSelection.ts", join(directory, "StudioSelection.js"), {
    "./StudioObjectBounds": "./StudioObjectBounds.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioKeyboard.ts", join(directory, "StudioKeyboard.js"), {
    "./StudioSelection": "./StudioSelection.js"
  });

  return import(pathToFileURL(join(directory, "StudioKeyboard.js")).href);
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
    name: "Keyboard Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 }
    ]
  };
}

test("Studio keyboard arrows move the selected object", async (t) => {
  const module = await importKeyboardModule(t);
  const result = module.applyStudioKeyboardCommand({
    scene: createScene(),
    selectedObjectId: "rect-1",
    command: { key: "ArrowRight", shiftKey: true }
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].x, 20);
  assert.equal(result.scene.objects[0].y, 20);
});

test("Studio keyboard arrows move a multi-selection group", async (t) => {
  const module = await importKeyboardModule(t);
  const result = module.applyStudioKeyboardCommand({
    scene: createScene(),
    selectedObjectIds: ["rect-1", "circle-1"],
    command: { key: "ArrowDown", shiftKey: true }
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].y, 30);
  assert.equal(result.scene.objects[1].y, 70);
  assert.deepEqual(result.selectedObjectIds, ["rect-1", "circle-1"]);
});

test("Studio keyboard delete removes the selected object", async (t) => {
  const module = await importKeyboardModule(t);
  const result = module.applyStudioKeyboardCommand({
    scene: createScene(),
    selectedObjectId: "circle-1",
    command: { key: "Delete", shiftKey: false }
  });

  assert.equal(result.handled, true);
  assert.equal(result.selectedObjectId, undefined);
  assert.deepEqual(
    result.scene.objects.map((object) => object.id),
    ["rect-1"]
  );
});

test("Studio keyboard delete removes a multi-selection group", async (t) => {
  const module = await importKeyboardModule(t);
  const result = module.applyStudioKeyboardCommand({
    scene: createScene(),
    selectedObjectIds: ["rect-1", "circle-1"],
    command: { key: "Delete", shiftKey: false }
  });

  assert.equal(result.handled, true);
  assert.deepEqual(result.selectedObjectIds, []);
  assert.deepEqual(result.scene.objects, []);
});

test("Studio keyboard escape clears selection without mutating the scene", async (t) => {
  const module = await importKeyboardModule(t);
  const scene = createScene();
  const result = module.applyStudioKeyboardCommand({
    scene,
    selectedObjectId: "rect-1",
    command: { key: "Escape", shiftKey: false }
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene, scene);
  assert.equal(result.selectedObjectId, undefined);
});

test("Studio keyboard maps undo and redo shortcuts", async (t) => {
  const module = await importKeyboardModule(t);

  assert.equal(module.getStudioHistoryKeyboardAction({ key: "z", shiftKey: false, ctrlKey: true }), "undo");
  assert.equal(module.getStudioHistoryKeyboardAction({ key: "z", shiftKey: true, metaKey: true }), "redo");
  assert.equal(module.getStudioHistoryKeyboardAction({ key: "y", shiftKey: false, ctrlKey: true }), "redo");
  assert.equal(module.getStudioHistoryKeyboardAction({ key: "z", shiftKey: false }), undefined);
});
