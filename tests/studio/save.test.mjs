import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importSaveModule() {
  const source = readFileSync("apps/studio/src/StudioSave.ts", "utf8");
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
    name: "Save Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      {
        id: "rect-1",
        type: "rect",
        name: "Rect 1",
        x: 10,
        y: 20,
        width: 100,
        height: 80,
        material: { fillColor: "#35c2ff", strokeColor: "#dff5ff", lineWidth: 2 }
      }
    ]
  };
}

test("Studio save serializes the stable scene schema", async () => {
  const module = await importSaveModule();
  const json = module.serializeStudioScene(createScene());

  assert.equal(
    json,
    `{
  "version": 1,
  "name": "Save Test",
  "rendererMode": "canvas",
  "camera": {
    "x": 0,
    "y": 0,
    "zoom": 1
  },
  "objects": [
    {
      "id": "rect-1",
      "type": "rect",
      "name": "Rect 1",
      "x": 10,
      "y": 20,
      "width": 100,
      "height": 80,
      "material": {
        "fillColor": "#35c2ff",
        "strokeColor": "#dff5ff",
        "lineWidth": 2
      }
    }
  ]
}
`
  );
});

test("Studio save creates a stable scene filename", async () => {
  const module = await importSaveModule();

  assert.equal(module.createStudioSceneFilename(createScene()), "save-test.raw2d.json");
});
