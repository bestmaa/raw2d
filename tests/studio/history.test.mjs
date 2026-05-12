import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importHistoryModule() {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-history-"));

  await writeTranspiledModule("apps/studio/src/StudioCommand.ts", join(directory, "StudioCommand.js"));
  await writeTranspiledModule("apps/studio/src/StudioHistory.ts", join(directory, "StudioHistory.js"));

  return import(pathToFileURL(join(directory, "StudioHistory.js")).href);
}

async function writeTranspiledModule(sourcePath, outputPath) {
  const source = await readFile(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText.replaceAll('from "./StudioCommand";', 'from "./StudioCommand.js";');

  await writeFile(outputPath, output);
}

function createScene() {
  return {
    version: 1,
    name: "History Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 70, radius: 30 }
    ]
  };
}

test("Studio history records commands and clears redo on new edits", async () => {
  const module = await importHistoryModule();
  const command = {
    kind: "update-transform",
    objectId: "rect-1",
    before: { x: 10 },
    after: { x: 40 }
  };
  const createCommand = {
    kind: "create-object",
    object: { id: "text-1", type: "text2d", name: "Text 1", x: 90, y: 40, text: "Undo" }
  };
  const first = module.applyStudioHistoryCommand({ scene: createScene(), history: module.createStudioHistory(), command });
  const undone = module.undoStudioHistory({ scene: first.scene, history: first.history });
  const second = module.applyStudioHistoryCommand({ scene: undone.scene, history: undone.history, command: createCommand });

  assert.equal(first.scene.objects[0].x, 40);
  assert.equal(first.history.undoStack.length, 1);
  assert.equal(undone.scene.objects[0].x, 10);
  assert.equal(undone.history.redoStack.length, 1);
  assert.equal(second.history.redoStack.length, 0);
  assert.equal(second.scene.objects.at(-1).id, "text-1");
});

test("Studio history redo reapplies the last undone command", async () => {
  const module = await importHistoryModule();
  const command = {
    kind: "set-visibility",
    objectId: "rect-1",
    before: undefined,
    after: false
  };
  const applied = module.applyStudioHistoryCommand({ scene: createScene(), history: module.createStudioHistory(), command });
  const undone = module.undoStudioHistory({ scene: applied.scene, history: applied.history });
  const redone = module.redoStudioHistory({ scene: undone.scene, history: undone.history });

  assert.equal(undone.scene.objects[0].visible, undefined);
  assert.equal(redone.scene.objects[0].visible, false);
  assert.equal(redone.history.undoStack.length, 1);
  assert.equal(redone.history.redoStack.length, 0);
});

test("Studio history ignores unhandled commands and empty stacks", async () => {
  const module = await importHistoryModule();
  const history = module.createStudioHistory();
  const command = {
    kind: "update-material",
    objectId: "missing",
    before: undefined,
    after: { fillColor: "#ff0000" }
  };
  const applied = module.applyStudioHistoryCommand({ scene: createScene(), history, command });
  const undone = module.undoStudioHistory({ scene: applied.scene, history: applied.history });
  const redone = module.redoStudioHistory({ scene: applied.scene, history: applied.history });

  assert.equal(applied.handled, false);
  assert.equal(applied.history.undoStack.length, 0);
  assert.equal(undone.handled, false);
  assert.equal(redone.handled, false);
});

test("Studio history trims undo and redo stacks to the configured limit", async () => {
  const module = await importHistoryModule();
  let scene = createScene();
  let history = module.createStudioHistory({ limit: 2 });

  for (const x of [20, 30, 40]) {
    const result = module.applyStudioHistoryCommand({
      scene,
      history,
      command: { kind: "update-transform", objectId: "rect-1", before: { x: scene.objects[0].x }, after: { x } }
    });
    scene = result.scene;
    history = result.history;
  }

  const firstUndo = module.undoStudioHistory({ scene, history });
  const secondUndo = module.undoStudioHistory({ scene: firstUndo.scene, history: firstUndo.history });
  const thirdUndo = module.undoStudioHistory({ scene: secondUndo.scene, history: secondUndo.history });

  assert.equal(history.undoStack.length, 2);
  assert.equal(secondUndo.scene.objects[0].x, 20);
  assert.equal(thirdUndo.handled, false);
  assert.equal(secondUndo.history.redoStack.length, 2);
});
