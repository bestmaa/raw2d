import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importResizeModule() {
  const boxUrl = moduleUrl(transpile(readFileSync("apps/studio/src/StudioBoxResize.ts", "utf8")));
  const lineUrl = moduleUrl(transpile(readFileSync("apps/studio/src/StudioLineResize.ts", "utf8")));
  const textUrl = moduleUrl(transpile(readFileSync("apps/studio/src/StudioTextResize.ts", "utf8")));
  const graphUrl = moduleUrl(transpile(readFileSync("apps/studio/src/StudioSceneGraph.ts", "utf8")));
  const boundsOutput = transpile(readFileSync("apps/studio/src/StudioObjectBounds.ts", "utf8"))
    .replaceAll('from "./StudioLineResize";', `from "${lineUrl}";`)
    .replaceAll('from "./StudioTextResize";', `from "${textUrl}";`);
  const resizeOutput = transpile(readFileSync("apps/studio/src/StudioResize.ts", "utf8"))
    .replaceAll('from "./StudioBoxResize";', `from "${boxUrl}";`)
    .replaceAll('from "./StudioLineResize";', `from "${lineUrl}";`)
    .replaceAll('from "./StudioObjectBounds";', `from "${moduleUrl(boundsOutput)}";`)
    .replaceAll('from "./StudioSceneGraph";', `from "${graphUrl}";`)
    .replaceAll('from "./StudioTextResize";', `from "${textUrl}";`);

  return import(moduleUrl(resizeOutput));
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
}

function moduleUrl(output) {
  return `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
}

test("Studio resize handles use world coordinates for grouped children", async () => {
  const module = await importResizeModule();
  const scene = {
    version: 1,
    name: "Grouped Resize Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      {
        id: "group-1",
        type: "group",
        name: "Group 1",
        x: 100,
        y: 80,
        children: [{ id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 50, height: 30 }]
      }
    ]
  };

  assert.deepEqual(module.getStudioResizeHandles(scene, "rect-1"), [
    { id: "top-left", x: 110, y: 100, size: 10 },
    { id: "top-right", x: 160, y: 100, size: 10 },
    { id: "bottom-left", x: 110, y: 130, size: 10 },
    { id: "bottom-right", x: 160, y: 130, size: 10 }
  ]);

  const resizeStart = module.startStudioResize(scene, "rect-1", { x: 110, y: 100 });
  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({ scene, session: resizeStart.session, pointer: { x: 120, y: 115 } });
  const rect = nextScene.objects[0].children[0];
  assert.equal(rect.x, 20);
  assert.equal(rect.y, 34);
  assert.equal(rect.width, 40);
  assert.equal(rect.height, 16);
});

test("Studio line resize converts grouped child pointer positions to local endpoints", async () => {
  const module = await importResizeModule();
  const scene = {
    version: 1,
    name: "Grouped Line Resize Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      {
        id: "group-1",
        type: "group",
        name: "Group 1",
        x: 200,
        y: 50,
        children: [{ id: "line-1", type: "line", name: "Line 1", x: 10, y: 20, startX: 0, startY: 0, endX: 40, endY: 0 }]
      }
    ]
  };

  assert.deepEqual(module.getStudioResizeHandles(scene, "line-1"), [
    { id: "line-start", x: 210, y: 70, size: 10 },
    { id: "line-end", x: 250, y: 70, size: 10 }
  ]);

  const resizeStart = module.startStudioResize(scene, "line-1", { x: 250, y: 70 });
  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({ scene, session: resizeStart.session, pointer: { x: 260, y: 90 } });
  const line = nextScene.objects[0].children[0];
  assert.equal(line.endX, 50);
  assert.equal(line.endY, 20);
});
