import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importResizeModule() {
  const source = readFileSync("apps/studio/src/StudioResize.ts", "utf8");
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
    name: "Resize Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "sprite-1", type: "sprite", name: "Sprite 1", x: 160, y: 40, width: 64, height: 64, assetSlot: "empty" },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 }
    ]
  };
}

test("Studio resize handles appear only for Rect and Sprite selections", async () => {
  const module = await importResizeModule();

  assert.equal(module.getStudioResizeHandles(createScene(), "rect-1").length, 4);
  assert.equal(module.getStudioResizeHandles(createScene(), "sprite-1").length, 4);
  assert.equal(module.getStudioResizeHandles(createScene(), "circle-1").length, 0);
});

test("Studio bottom-right resize updates width and height immutably", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "rect-1", { x: 110, y: 100 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 135, y: 130 }
  });

  assert.equal(scene.objects[0].width, 100);
  assert.equal(scene.objects[0].height, 80);
  assert.equal(nextScene.objects[0].x, 10);
  assert.equal(nextScene.objects[0].y, 20);
  assert.equal(nextScene.objects[0].width, 125);
  assert.equal(nextScene.objects[0].height, 110);
});

test("Studio top-left resize keeps the opposite corner fixed", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "sprite-1", { x: 160, y: 40 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 150, y: 30 }
  });

  assert.equal(nextScene.objects[1].x, 150);
  assert.equal(nextScene.objects[1].y, 30);
  assert.equal(nextScene.objects[1].width, 74);
  assert.equal(nextScene.objects[1].height, 74);
});
