import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importRenderAdapterModule() {
  const source = readFileSync("apps/studio/src/StudioRenderAdapter.ts", "utf8");
  const raw2dUrl = pathToFileURL(`${process.cwd()}/packages/raw2d/dist/raw2d.js`).href;
  const output = ts
    .transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022
      }
    })
    .outputText.replaceAll('from "raw2d"', `from "${raw2dUrl}"`);
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio render adapter creates Raw2D runtime scene", async () => {
  const module = await importRenderAdapterModule();
  const runtime = module.createRuntimeSceneFromStudioState({
    version: 1,
    name: "Adapter Test",
    rendererMode: "canvas",
    camera: { x: 4, y: 8, zoom: 2 },
    objects: [
      { id: "rect-1", type: "rect", name: "Card", x: 10, y: 20, width: 80, height: 40 },
      { id: "text-1", type: "text2d", name: "Label", x: 12, y: 24, text: "Raw2D" }
    ]
  });

  assert.equal(runtime.scene.name, "Adapter Test");
  assert.deepEqual(runtime.camera.getTransform(), { x: 4, y: 8, zoom: 2 });
  assert.equal(runtime.scene.getObjects().length, 2);
  assert.equal(runtime.objects[0].name, "Card");
  assert.equal(runtime.objects[1].name, "Label");
});
