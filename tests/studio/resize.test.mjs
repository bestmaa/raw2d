import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importResizeModule() {
  const boxSource = readFileSync("apps/studio/src/StudioBoxResize.ts", "utf8");
  const boxOutput = transpile(boxSource);
  const boxUrl = `data:text/javascript;base64,${Buffer.from(boxOutput).toString("base64")}`;
  const lineSource = readFileSync("apps/studio/src/StudioLineResize.ts", "utf8");
  const lineOutput = transpile(lineSource);
  const lineUrl = `data:text/javascript;base64,${Buffer.from(lineOutput).toString("base64")}`;
  const textSource = readFileSync("apps/studio/src/StudioTextResize.ts", "utf8");
  const textOutput = transpile(textSource);
  const textUrl = `data:text/javascript;base64,${Buffer.from(textOutput).toString("base64")}`;
  const boundsSource = readFileSync("apps/studio/src/StudioObjectBounds.ts", "utf8");
  const boundsOutput = transpile(boundsSource)
    .replaceAll('from "./StudioLineResize";', `from "${lineUrl}";`)
    .replaceAll('from "./StudioTextResize";', `from "${textUrl}";`);
  const boundsUrl = `data:text/javascript;base64,${Buffer.from(boundsOutput).toString("base64")}`;
  const source = readFileSync("apps/studio/src/StudioResize.ts", "utf8");
  const output = transpile(source)
    .replaceAll('from "./StudioBoxResize";', `from "${boxUrl}";`)
    .replaceAll('from "./StudioLineResize";', `from "${lineUrl}";`)
    .replaceAll('from "./StudioObjectBounds";', `from "${boundsUrl}";`)
    .replaceAll('from "./StudioTextResize";', `from "${textUrl}";`);
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
}

function createScene() {
  return {
    version: 1,
    name: "Resize Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 10, y: 20, width: 100, height: 80 },
      { id: "sprite-1", type: "sprite", name: "Sprite 1", x: 160, y: 40, width: 64, height: 64, assetSlot: "empty" },
      { id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 },
      { id: "line-1", type: "line", name: "Line 1", x: 120, y: 300, startX: 0, startY: 0, endX: 240, endY: 0 },
      { id: "text-1", type: "text2d", name: "Text 1", x: 80, y: 180, text: "Raw2D", font: "24px sans-serif" }
    ]
  };
}

test("Studio resize handles appear for Rect Sprite Circle Line and Text selections", async () => {
  const module = await importResizeModule();

  assert.equal(module.getStudioResizeHandles(createScene(), "rect-1").length, 4);
  assert.equal(module.getStudioResizeHandles(createScene(), "sprite-1").length, 4);
  assert.deepEqual(module.getStudioResizeHandles(createScene(), "circle-1"), [
    { id: "top-left", x: 30, y: 30, size: 10 },
    { id: "top-right", x: 90, y: 30, size: 10 },
    { id: "bottom-left", x: 30, y: 90, size: 10 },
    { id: "bottom-right", x: 90, y: 90, size: 10 }
  ]);
  assert.deepEqual(module.getStudioResizeHandles(createScene(), "line-1"), [
    { id: "line-start", x: 120, y: 300, size: 10 },
    { id: "line-end", x: 360, y: 300, size: 10 }
  ]);
  assert.deepEqual(module.getStudioResizeHandles(createScene(), "text-1"), [
    { id: "top-left", x: 80, y: 156, size: 10 },
    { id: "top-right", x: 152, y: 156, size: 10 },
    { id: "bottom-left", x: 80, y: 186, size: 10 },
    { id: "bottom-right", x: 152, y: 186, size: 10 }
  ]);
});

test("Studio bottom-right resize updates width and height immutably", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "rect-1", { x: 110, y: 100 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 135, y: 130 }
  });

  assert.equal(scene.objects[0].width, 100);
  assert.equal(scene.objects[0].height, 80);
  assert.equal(nextScene.objects[0].x, 10);
  assert.equal(nextScene.objects[0].y, 20);
  assert.equal(nextScene.objects[0].width, 125);
  assert.equal(nextScene.objects[0].height, 110);
});

test("Studio top-left resize keeps the opposite corner fixed", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "sprite-1", { x: 160, y: 40 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 150, y: 30 }
  });

  assert.equal(nextScene.objects[1].x, 150);
  assert.equal(nextScene.objects[1].y, 30);
  assert.equal(nextScene.objects[1].width, 74);
  assert.equal(nextScene.objects[1].height, 74);
});

test("Studio corner resize flips bounds after crossing the opposite corner", async () => {
  const module = await importResizeModule();
  const cases = [
    { handle: { x: 10, y: 20 }, pointer: { x: 140, y: 130 }, expected: { x: 110, y: 100, width: 30, height: 30 } },
    { handle: { x: 110, y: 20 }, pointer: { x: -30, y: 130 }, expected: { x: -30, y: 100, width: 40, height: 30 } },
    { handle: { x: 110, y: 100 }, pointer: { x: -40, y: -30 }, expected: { x: -40, y: -30, width: 50, height: 50 } },
    { handle: { x: 10, y: 100 }, pointer: { x: 150, y: -20 }, expected: { x: 110, y: -20, width: 40, height: 40 } }
  ];

  for (const resizeCase of cases) {
    const scene = createScene();
    const resizeStart = module.startStudioResize(scene, "rect-1", resizeCase.handle);

    assert.ok(resizeStart);

    const nextScene = module.resizeStudioObject({
      scene,
      session: resizeStart.session,
      pointer: resizeCase.pointer
    });

    assert.equal(nextScene.objects[0].x, resizeCase.expected.x);
    assert.equal(nextScene.objects[0].y, resizeCase.expected.y);
    assert.equal(nextScene.objects[0].width, resizeCase.expected.width);
    assert.equal(nextScene.objects[0].height, resizeCase.expected.height);
  }
});

test("Studio Circle corner resize updates center and radius from square bounds", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "circle-1", { x: 90, y: 90 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 120, y: 110 }
  });

  assert.equal(scene.objects[2].radius, 30);
  assert.equal(nextScene.objects[2].x, 75);
  assert.equal(nextScene.objects[2].y, 75);
  assert.equal(nextScene.objects[2].radius, 45);
});

test("Studio Circle resize keeps radius positive after crossing the opposite corner", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "circle-1", { x: 30, y: 30 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 110, y: 105 }
  });

  assert.equal(nextScene.objects[2].x, 100);
  assert.equal(nextScene.objects[2].y, 100);
  assert.equal(nextScene.objects[2].radius, 10);
  assert.ok(nextScene.objects[2].radius > 0);
});

test("Studio Line start endpoint handle edits local start point", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "line-1", { x: 120, y: 300 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 150, y: 330 }
  });

  assert.equal(nextScene.objects[3].x, 120);
  assert.equal(nextScene.objects[3].y, 300);
  assert.equal(nextScene.objects[3].startX, 30);
  assert.equal(nextScene.objects[3].startY, 30);
  assert.equal(nextScene.objects[3].endX, 240);
  assert.equal(nextScene.objects[3].endY, 0);
});

test("Studio Line end endpoint handle edits local end point", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "line-1", { x: 360, y: 300 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 330, y: 280 }
  });

  assert.equal(nextScene.objects[3].startX, 0);
  assert.equal(nextScene.objects[3].startY, 0);
  assert.equal(nextScene.objects[3].endX, 210);
  assert.equal(nextScene.objects[3].endY, -20);
});

test("Studio Text2D corner resize scales font size from explicit text bounds", async () => {
  const module = await importResizeModule();
  const scene = createScene();
  const resizeStart = module.startStudioResize(scene, "text-1", { x: 152, y: 186 });

  assert.ok(resizeStart);

  const nextScene = module.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 188, y: 201 }
  });

  assert.equal(nextScene.objects[4].x, 80);
  assert.equal(nextScene.objects[4].y, 192);
  assert.equal(nextScene.objects[4].font, "36px sans-serif");
});
