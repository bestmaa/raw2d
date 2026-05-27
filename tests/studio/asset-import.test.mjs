import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importAssetImportModule() {
  const source = readFileSync("apps/studio/src/StudioAssetImport.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio image asset import reads local file metadata for preview state", async () => {
  const module = await importAssetImportModule();
  const file = new File(["raw2d"], "hero.png", { type: "image/png" });
  const image = createFakeImage({ width: 320, height: 180 });
  const asset = await module.createStudioImageAssetInputFromFile({
    file,
    createObjectUrl: () => "blob:hero",
    imageFactory: () => image
  });

  assert.deepEqual(asset, {
    name: "hero.png",
    width: 320,
    height: 180,
    src: "blob:hero",
    mimeType: "image/png"
  });
});

function createFakeImage(dimensions) {
  return {
    naturalWidth: dimensions.width,
    naturalHeight: dimensions.height,
    width: dimensions.width,
    height: dimensions.height,
    onload: null,
    onerror: null,
    set src(_value) {
      queueMicrotask(() => {
        this.onload?.();
      });
    }
  };
}
