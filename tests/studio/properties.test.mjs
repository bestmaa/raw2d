import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importPropertiesModule() {
  const source = readFileSync("apps/studio/src/StudioProperties.ts", "utf8");
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
    name: "Properties Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [{ id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 }]
  };
}

test("Studio property edit updates transform fields immutably", async () => {
  const module = await importPropertiesModule();
  const scene = createScene();
  const result = module.applyStudioPropertyEdit({
    scene,
    selectedObjectId: "rect-1",
    propertyId: "width",
    value: "140"
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].width, 140);
  assert.equal(scene.objects[0].width, 100);
});

test("Studio property edit updates material fields", async () => {
  const module = await importPropertiesModule();
  const result = module.applyStudioPropertyEdit({
    scene: createScene(),
    selectedObjectId: "rect-1",
    propertyId: "fillColor",
    value: "#ff0000"
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].material.fillColor, "#ff0000");
});

test("Studio property edit ignores invalid numbers", async () => {
  const module = await importPropertiesModule();
  const result = module.applyStudioPropertyEdit({
    scene: createScene(),
    selectedObjectId: "rect-1",
    propertyId: "height",
    value: "wide"
  });

  assert.equal(result.handled, false);
  assert.equal(result.scene.objects[0].height, 80);
});
