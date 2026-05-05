import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importInspectorModule() {
  const source = readFileSync("apps/studio/src/StudioInspector.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio inspector uses selected object for properties", async () => {
  const module = await importInspectorModule();
  const scene = {
    version: 1,
    name: "Selection Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 160, height: 96 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 30, y: 40, radius: 56 }
    ]
  };
  const inspector = module.createStudioInspectorModel(scene, "Canvas", {
    selectedObjectId: "rect-1"
  });

  assert.equal(inspector.properties.find((row) => row.label === "Selection")?.value, "Rect 1");
  assert.equal(inspector.properties.find((row) => row.label === "Width")?.value, "160");
  assert.equal(inspector.properties.some((row) => row.label === "Radius"), false);
});

test("Studio inspector shows no active object when selection is clear", async () => {
  const module = await importInspectorModule();
  const scene = {
    version: 1,
    name: "Selection Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [{ id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 160, height: 96 }]
  };
  const inspector = module.createStudioInspectorModel(scene, "Canvas");

  assert.equal(inspector.properties.find((row) => row.label === "Selection")?.value, "None");
  assert.equal(inspector.properties.some((row) => row.label === "Width"), false);
});
