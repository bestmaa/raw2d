import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importDragModule() {
  const source = readFileSync("apps/studio/src/StudioDrag.ts", "utf8");
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
    name: "Drag Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 }
    ]
  };
}

test("Studio drag starts from the topmost object under the pointer", async () => {
  const module = await importDragModule();
  const dragStart = module.startStudioDrag(createScene(), undefined, { x: 60, y: 60 });

  assert.equal(dragStart?.selectedObjectId, "circle-1");
  assert.equal(dragStart?.session.objectId, "circle-1");
});

test("Studio drag moves selected object without mutating the source scene", async () => {
  const module = await importDragModule();
  const scene = createScene();
  const dragStart = module.startStudioDrag(scene, "rect-1", { x: 20, y: 30 });

  assert.ok(dragStart);

  const nextScene = module.moveStudioObject({
    scene,
    session: dragStart.session,
    pointer: { x: 44, y: 51 }
  });

  assert.equal(scene.objects[0].x, 10);
  assert.equal(scene.objects[0].y, 20);
  assert.equal(nextScene.objects[0].x, 34);
  assert.equal(nextScene.objects[0].y, 41);
  assert.equal(nextScene.objects[1], scene.objects[1]);
});

test("Studio drag does not start when the selected object is missed", async () => {
  const module = await importDragModule();
  const dragStart = module.startStudioDrag(createScene(), "rect-1", { x: 300, y: 300 });

  assert.equal(dragStart, undefined);
});
