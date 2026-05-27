import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importCanvasCodeExportModule() {
  const source = readFileSync("apps/studio/src/StudioCanvasCodeExport.ts", "utf8");
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
    name: "Export Test",
    rendererMode: "canvas",
    camera: { x: 4, y: 8, zoom: 2 },
    assets: [],
    objects: [
      {
        id: "rect-1",
        type: "rect",
        name: "Card",
        x: 10,
        y: 20,
        width: 120,
        height: 80,
        material: { fillColor: "#35c2ff", lineWidth: 2 }
      },
      { id: "text-1", type: "text2d", name: "Label", x: 40, y: 60, text: "Raw2D", font: "24px sans-serif" },
      { id: "sprite-1", type: "sprite", name: "Sprite", x: 80, y: 90, width: 32, height: 32, assetSlot: "asset-1" }
    ]
  };
}

test("Studio Canvas code export generates public Raw2D code", async () => {
  const module = await importCanvasCodeExportModule();
  const code = module.createStudioCanvasCode({ scene: createScene() });

  assert.match(code, /from "raw2d"/);
  assert.match(code, /new Canvas/);
  assert.match(code, /new Scene/);
  assert.match(code, /new Camera2D/);
  assert.match(code, /new Rect/);
  assert.match(code, /new Text2D/);
  assert.match(code, /new Sprite/);
  assert.match(code, /new Texture/);
  assert.match(code, /new BasicMaterial/);
  assert.match(code, /renderer\.render\(scene, camera\)/);
  assert.doesNotMatch(code, /Studio/);
  assert.doesNotMatch(code, /apps\/studio/);
});

test("Studio Canvas code export copies generated code to clipboard", async () => {
  const module = await importCanvasCodeExportModule();
  let clipboardText = "";
  const code = await module.copyStudioCanvasCode({
    scene: createScene(),
    clipboard: {
      async writeText(value) {
        clipboardText = value;
      }
    }
  });

  assert.equal(clipboardText, code);
  assert.match(clipboardText, /new Canvas/);
});
