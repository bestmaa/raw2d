import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  generateRaw2DCanvasExample,
  generateRaw2DWebGLExample
} from "../../packages/mcp/dist/index.js";

test("generateRaw2DCanvasExample creates buildable Canvas code", async () => {
  const scene = createExampleScene();
  const example = generateRaw2DCanvasExample({ document: scene });

  assert.equal(example.renderer, "canvas");
  assert.match(example.code, /new Canvas/);
  assert.match(example.code, /new Rect/);
  await assertBuilds(example.code);
});

test("generateRaw2DWebGLExample creates buildable WebGL code", async () => {
  const scene = createExampleScene();
  const example = generateRaw2DWebGLExample({ document: scene });

  assert.equal(example.renderer, "webgl2");
  assert.match(example.code, /new WebGLRenderer2D/);
  assert.match(example.code, /renderer.render\(scene, camera\)/);
  await assertBuilds(example.code);
});

function createExampleScene() {
  const withRect = addRaw2DSceneObject({
    document: createRaw2DSceneJson({ camera: { x: 0, y: 0, zoom: 1 } }),
    object: { type: "rect", id: "card", x: 80, y: 64, width: 160, height: 96, material: { fillColor: "#35c2ff" } }
  });
  const withLine = addRaw2DSceneObject({
    document: withRect,
    object: { type: "line", id: "axis", startX: 0, startY: 0, endX: 120, endY: 0 }
  });

  return addRaw2DSceneObject({
    document: withLine,
    object: { type: "text2d", id: "label", text: "Raw2D", font: "20px sans-serif" }
  });
}

async function assertBuilds(code) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-generated-"));
  const file = join(directory, "example.ts");
  const config = join(directory, "tsconfig.json");

  await writeFile(file, code);
  await writeFile(
    config,
    JSON.stringify({
      compilerOptions: {
        strict: true,
        module: "esnext",
        moduleResolution: "bundler",
        target: "es2023",
        lib: ["ES2023", "DOM"],
        skipLibCheck: true,
        paths: {
          raw2d: [join(process.cwd(), "packages/raw2d/src/index.ts")]
        }
      },
      include: [file]
    })
  );

  try {
    execFileSync("./node_modules/.bin/tsc", ["--noEmit", "--project", config]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
