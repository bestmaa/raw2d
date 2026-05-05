import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importPngExportModule() {
  const source = readFileSync("apps/studio/src/StudioPngExport.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio PNG export creates a stable filename", async () => {
  const module = await importPngExportModule();

  assert.equal(module.createStudioPngFilename("Sample Scene"), "sample-scene.png");
  assert.equal(module.createStudioPngFilename("   "), "raw2d-scene.png");
});

test("Studio PNG export reads the canvas data URL", async () => {
  const module = await importPngExportModule();
  const root = {
    querySelector() {
      return {
        toDataURL(type) {
          assert.equal(type, "image/png");
          return "data:image/png;base64,raw2d";
        }
      };
    }
  };

  assert.equal(module.getStudioCanvasPngDataUrl(root), "data:image/png;base64,raw2d");
});
