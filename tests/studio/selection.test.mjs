import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importSelectionModules(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-selection-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeTranspiledModule("apps/studio/src/StudioSceneGraph.ts", join(directory, "StudioSceneGraph.js"));
  await writeTranspiledModule("apps/studio/src/StudioLineResize.ts", join(directory, "StudioLineResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioTextResize.ts", join(directory, "StudioTextResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioObjectBounds.ts", join(directory, "StudioObjectBounds.js"), {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioDrag.ts", join(directory, "StudioDrag.js"), {
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioObjectBounds": "./StudioObjectBounds.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioSelection.ts", join(directory, "StudioSelection.js"), {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioMultiDrag.ts", join(directory, "StudioMultiDrag.js"), {
    "./StudioDrag": "./StudioDrag.js",
    "./StudioSelection": "./StudioSelection.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });

  return {
    selection: await import(pathToFileURL(join(directory, "StudioSelection.js")).href),
    multiDrag: await import(pathToFileURL(join(directory, "StudioMultiDrag.js")).href)
  };
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
    name: "Selection Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 180, y: 90, radius: 30 },
      { id: "text-1", type: "text2d", name: "Text 1", x: 120, y: 170, text: "Layer", font: "20px sans-serif" }
    ]
  };
}

test("Studio selection toggles ids and computes group bounds", async (t) => {
  const modules = await importSelectionModules(t);
  const scene = createScene();
  const selection = modules.selection.updateStudioSelection({
    scene,
    selectedObjectIds: ["rect-1"],
    objectId: "circle-1",
    additive: true
  });

  assert.deepEqual(selection, ["rect-1", "circle-1"]);
  assert.deepEqual(modules.selection.getStudioSelectionBounds({ scene, selectedObjectIds: selection, minimumCount: 2 }), {
    x: 10,
    y: 20,
    width: 200,
    height: 100
  });
});

test("Studio multi drag moves selected objects as a group", async (t) => {
  const modules = await importSelectionModules(t);
  const scene = createScene();
  const start = modules.multiDrag.startStudioMultiDrag(scene, ["rect-1", "circle-1"], { x: 20, y: 30 });

  assert.ok(start);

  const moved = modules.multiDrag.moveStudioObjects({
    scene,
    session: start.session,
    pointer: { x: 45, y: 40 }
  });

  assert.equal(moved.objects[0].x, 35);
  assert.equal(moved.objects[0].y, 30);
  assert.equal(moved.objects[1].x, 205);
  assert.equal(moved.objects[1].y, 100);
  assert.equal(moved.objects[2].x, 120);
});
