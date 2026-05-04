import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importFactoryModule() {
  const source = readFileSync("apps/studio/src/StudioObjectFactory.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio Rect tool factory appends a renderable Rect object", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Tool Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: []
  };
  const nextScene = module.addStudioRectObject({ scene });

  assert.equal(scene.objects.length, 0);
  assert.equal(nextScene.objects.length, 1);
  assert.deepEqual(nextScene.objects[0], {
    id: "rect-1",
    type: "rect",
    name: "Rect 1",
    x: 120,
    y: 120,
    width: 160,
    height: 96,
    material: {
      fillColor: "#35c2ff",
      strokeColor: "#dff5ff",
      lineWidth: 2
    }
  });
});

test("Studio Rect tool factory offsets repeated Rect objects", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Tool Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [{ id: "rect-1", type: "rect", name: "Rect 1", x: 120, y: 120, width: 160, height: 96 }]
  };
  const nextScene = module.addStudioRectObject({ scene });
  const rect = nextScene.objects[1];

  assert.equal(rect.id, "rect-2");
  assert.equal(rect.x, 144);
  assert.equal(rect.y, 144);
});

test("Studio Circle tool factory appends a renderable Circle object", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Tool Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: []
  };
  const nextScene = module.addStudioCircleObject({ scene });

  assert.equal(nextScene.objects.length, 1);
  assert.deepEqual(nextScene.objects[0], {
    id: "circle-1",
    type: "circle",
    name: "Circle 1",
    x: 220,
    y: 180,
    radius: 56,
    material: {
      fillColor: "#f472b6",
      strokeColor: "#ffe4f1",
      lineWidth: 2
    }
  });
});

test("Studio Circle tool factory offsets repeated Circle objects", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Tool Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [{ id: "circle-1", type: "circle", name: "Circle 1", x: 220, y: 180, radius: 56 }]
  };
  const nextScene = module.addStudioCircleObject({ scene });
  const circle = nextScene.objects[1];

  assert.equal(circle.id, "circle-2");
  assert.equal(circle.x, 244);
  assert.equal(circle.y, 204);
});
