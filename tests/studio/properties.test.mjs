import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importPropertiesModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-properties-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeTranspiledModule("apps/studio/src/StudioSceneGraph.ts", join(directory, "StudioSceneGraph.js"));
  await writeTranspiledModule("apps/studio/src/StudioProperties.ts", join(directory, "StudioProperties.js"), {
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  return import(pathToFileURL(join(directory, "StudioProperties.js")).href);
}

async function writeTranspiledModule(sourcePath, outputPath, replacements = {}) {
  const source = await readFile(sourcePath, "utf8");
  let output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;

  for (const [from, to] of Object.entries(replacements)) {
    output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  }

  await writeFile(outputPath, output);
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

test("Studio property edit updates transform fields immutably", async (t) => {
  const module = await importPropertiesModule(t);
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

test("Studio property edit updates material fields", async (t) => {
  const module = await importPropertiesModule(t);
  const result = module.applyStudioPropertyEdit({
    scene: createScene(),
    selectedObjectId: "rect-1",
    propertyId: "fillColor",
    value: "#ff0000"
  });

  assert.equal(result.handled, true);
  assert.equal(result.scene.objects[0].material.fillColor, "#ff0000");
});

test("Studio property edit ignores invalid numbers", async (t) => {
  const module = await importPropertiesModule(t);
  const result = module.applyStudioPropertyEdit({
    scene: createScene(),
    selectedObjectId: "rect-1",
    propertyId: "height",
    value: "wide"
  });

  assert.equal(result.handled, false);
  assert.equal(result.scene.objects[0].height, 80);
});
