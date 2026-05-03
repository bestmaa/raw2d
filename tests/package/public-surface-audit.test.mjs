import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageIndexPaths = [
  "packages/canvas/src/index.ts",
  "packages/core/src/index.ts",
  "packages/effects/src/index.ts",
  "packages/interaction/src/index.ts",
  "packages/mcp/src/index.ts",
  "packages/raw2d/src/index.ts",
  "packages/react/src/index.ts",
  "packages/sprite/src/index.ts",
  "packages/text/src/index.ts",
  "packages/webgl/src/index.ts"
];

const forbiddenExportsByPackage = new Map([
  ["packages/interaction/src/index.ts", ["InteractionControllerActions", "InteractionScope", "pointerCapture"]],
  ["packages/mcp/src/index.ts", ["generateRaw2DExampleHelpers"]],
  [
    "packages/react/src/index.ts",
    [
      "Raw2DReactContext",
      "RawMaterialProps",
      "RawObject2DProps",
      "applyRawMaterialProps",
      "applyRawObject2DProps",
      "useRaw2DSceneObject"
    ]
  ],
  ["packages/sprite/src/index.ts", ["createTextureAtlasPackerStats", "sortTextureAtlasPackerItems"]]
]);

const umbrellaForbiddenImports = [
  "raw2d-mcp",
  "raw2d-react",
  "CanvasObjectRenderer",
  "WebGLFloatBuffer",
  "WebGLTextTextureCache",
  "WebGLShapePathTextureCache",
  "createWebGLShapeBatch",
  "drawRect"
];

test("package source barrels keep known private helpers out", async () => {
  for (const indexPath of packageIndexPaths) {
    const source = await readFile(indexPath, "utf8");
    const forbiddenNames = forbiddenExportsByPackage.get(indexPath) ?? [];

    for (const forbiddenName of forbiddenNames) {
      assert.doesNotMatch(source, new RegExp(`\\\\b${forbiddenName}\\\\b`), `${indexPath} must not export ${forbiddenName}`);
    }
  }
});

test("umbrella source barrel keeps package internals out", async () => {
  const source = await readFile("packages/raw2d/src/index.ts", "utf8");

  for (const forbiddenName of umbrellaForbiddenImports) {
    assert.doesNotMatch(source, new RegExp(`\\\\b${forbiddenName}\\\\b`), `raw2d must not export ${forbiddenName}`);
  }
});

