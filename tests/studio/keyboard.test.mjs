import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importKeyboardModule() {
  const source = readFileSync("apps/studio/src/StudioKeyboard.ts", "utf8");
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
    name: "Keyboard Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 }
    ]
  };
}

test("Studio keyboard arrows move the selected object", async () => {
  const module = await importKeyboardModule();
  const result = module.applyStudioKeyboardCommand({
    scene: createScene(),
    selectedObjectId: "rect-1",
    command: { key: "ArrowRight", shiftKey: true }
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].x, 20);
  assert.equal(result.scene.objects[0].y, 20);
});

test("Studio keyboard delete removes the selected object", async () => {
  const module = await importKeyboardModule();
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

test("Studio keyboard escape clears selection without mutating the scene", async () => {
  const module = await importKeyboardModule();
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
