import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importWebGLCodeExportModule() {
  const source = readFileSync("apps/studio/src/StudioWebGLCodeExport.ts", "utf8");
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
    name: "WebGL Export Test",
    rendererMode: "webgl",
    camera: { x: 4, y: 8, zoom: 2 },
    assets: [],
    objects: [
      { id: "rect-1", type: "rect", name: "Card", x: 10, y: 20, width: 120, height: 80 },
      { id: "text-1", type: "text2d", name: "Label", x: 40, y: 60, text: "Raw2D", font: "24px sans-serif" },
      { id: "sprite-1", type: "sprite", name: "Sprite", x: 80, y: 90, width: 32, height: 32, assetSlot: "asset-1" }
    ]
  };
}

test("Studio WebGL code export generates public Raw2D code with warnings", async () => {
  const module = await importWebGLCodeExportModule();
  const code = module.createStudioWebGLCode({ scene: createScene() });

  assert.match(code, /from "raw2d"/);
  assert.match(code, /new WebGLRenderer2D/);
  assert.match(code, /isWebGL2Available\(\{ canvas \}\)/);
  assert.match(code, /WebGL support warning: WebGL2 is required/);
  assert.match(code, /Sprite texture sources are placeholders/);
  assert.match(code, /Text2D uses WebGL text textures/);
  assert.match(code, /diagnostics\.stats\.unsupported/);
  assert.match(code, /new Scene/);
  assert.match(code, /new Rect/);
  assert.match(code, /new Texture/);
  assert.doesNotMatch(code, /StudioRenderAdapter/);
  assert.doesNotMatch(code, /apps\/studio/);
});

test("Studio WebGL code export copies generated code to clipboard", async () => {
  const module = await importWebGLCodeExportModule();
  let clipboardText = "";
  const code = await module.copyStudioWebGLCode({
    scene: createScene(),
    clipboard: {
      async writeText(value) {
        clipboardText = value;
      }
    }
  });

  assert.equal(clipboardText, code);
  assert.match(clipboardText, /new WebGLRenderer2D/);
});
