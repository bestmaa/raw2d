import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importFactoryModule() {
  const source = readFileSync("apps/studio/src/StudioObjectFactory.ts", "utf8");
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
    name: "Tool Output",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    objects: []
  };
}

test("Studio drawing tools produce ordered scene JSON objects", async () => {
  const module = await importFactoryModule();
  const rectScene = module.addStudioRectObject({ scene: createScene() });
  const circleScene = module.addStudioCircleObject({ scene: rectScene });
  const lineScene = module.addStudioLineObject({ scene: circleScene });
  const textScene = module.addStudioTextObject({ scene: lineScene });
  const spriteScene = module.addStudioSpriteObject({ scene: textScene });

  assert.deepEqual(
    spriteScene.objects.map((object) => object.type),
    ["rect", "circle", "line", "text2d", "sprite"]
  );
  assert.deepEqual(
    spriteScene.objects.map((object) => object.id),
    ["rect-1", "circle-1", "line-1", "text-1", "sprite-1"]
  );
});

test("Studio drawing tools return new scene objects without mutating input", async () => {
  const module = await importFactoryModule();
  const baseScene = createScene();
  const nextScene = module.addStudioRectObject({ scene: baseScene });

  assert.notEqual(nextScene, baseScene);
  assert.equal(baseScene.objects.length, 0);
  assert.equal(nextScene.objects.length, 1);
});

test("Studio drawing tool output keeps renderer and camera state", async () => {
  const module = await importFactoryModule();
  const scene = {
    version: 1,
    name: "Camera State",
    rendererMode: "webgl",
    camera: { x: 12, y: 24, zoom: 2 },
    objects: []
  };
  const nextScene = module.addStudioCircleObject({ scene });

  assert.equal(nextScene.rendererMode, "webgl");
  assert.deepEqual(nextScene.camera, { x: 12, y: 24, zoom: 2 });
});
