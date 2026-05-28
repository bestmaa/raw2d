import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importNavigationModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-navigation-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeModule("apps/studio/src/StudioLineResize.ts", directory);
  await writeModule("apps/studio/src/StudioTextResize.ts", directory);
  await writeModule("apps/studio/src/StudioSceneGraph.ts", directory);
  await writeModule("apps/studio/src/StudioObjectBounds.ts", directory, {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeModule("apps/studio/src/StudioSelection.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  await writeModule("apps/studio/src/StudioNavigation.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioSelection": "./StudioSelection.js"
  });
  return import(pathToFileURL(join(directory, "StudioNavigation.js")).href);
}

async function writeModule(sourcePath, directory, replacements = {}) {
  let output = ts.transpileModule(await readFile(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  for (const [from, to] of Object.entries(replacements)) output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  await writeFile(join(directory, sourcePath.split("/").at(-1).replace(".ts", ".js")), output);
}

function createScene() {
  return {
    version: 1,
    name: "Navigation Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 100, y: 80, width: 80, height: 40 },
      { id: "rect-2", type: "rect", name: "Rect 2", x: 420, y: 260, width: 120, height: 90 },
      {
        id: "group-1",
        type: "group",
        name: "Group 1",
        x: 1200,
        y: 900,
        children: [{ id: "child-1", type: "circle", name: "Child 1", x: 40, y: 30, radius: 20 }]
      }
    ]
  };
}

test("Studio navigation fits scene and zooms to selected world bounds", async (t) => {
  const module = await importNavigationModule(t);
  const scene = createScene();
  const fit = module.fitStudioCameraToScene(scene);
  assert.ok(fit);
  assert.equal(fit.camera.zoom < 1, true);
  assert.equal(fit.camera.x < scene.camera.x, true);

  const zoomed = module.zoomStudioCameraToSelection({ scene, selectedObjectIds: ["child-1"] });
  assert.ok(zoomed);
  assert.equal(zoomed.camera.zoom, 4);
  assert.equal(zoomed.camera.x, 1140);
  assert.equal(zoomed.camera.y, 855);
});

test("Studio minimap includes viewport and selected nested objects", async (t) => {
  const module = await importNavigationModule(t);
  const model = module.createStudioMinimapModel({ scene: createScene(), selectedObjectIds: ["child-1"] });
  const selected = model.items.find((item) => item.id === "child-1");

  assert.equal(model.width, 160);
  assert.equal(model.height, 120);
  assert.ok(selected);
  assert.equal(selected.selected, true);
  assert.equal(model.viewport.width > 1, true);
  assert.equal(model.items.length, 4);
});
