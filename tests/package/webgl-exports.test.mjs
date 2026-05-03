import assert from "node:assert/strict";
import test from "node:test";
import * as WebGL from "raw2d-webgl";

test("raw2d-webgl runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(WebGL).sort(), getExpectedWebGLRuntimeExports());
});

test("raw2d-webgl exposes WebGL tools without owning core scene objects", () => {
  assert.equal(typeof WebGL.WebGLRenderer2D, "function");
  assert.equal(typeof WebGL.createWebGLShapeBatch, "function");
  assert.equal(typeof WebGL.WebGLFloatBuffer, "function");
  assert.equal(WebGL.Scene, undefined);
  assert.equal(WebGL.Rect, undefined);
  assert.equal(WebGL.Canvas, undefined);
});

function getExpectedWebGLRuntimeExports() {
  return [
    "WebGLBufferUploader",
    "WebGLFloatBuffer",
    "WebGLRenderer2D",
    "WebGLRenderer2DResources",
    "WebGLShapePathTextureCache",
    "WebGLStaticBatchCache",
    "WebGLTextTextureCache",
    "WebGLTextureCache",
    "analyzeWebGLSpriteBatching",
    "applyWebGLSpriteSorting",
    "classifyWebGLShapePathFill",
    "createMutableWebGLRenderStats",
    "createWebGLBufferUploaders",
    "createWebGLRectBatch",
    "createWebGLRenderRuns",
    "createWebGLShapeBatch",
    "createWebGLShapePathFallbackBatch",
    "createWebGLSpriteBatch",
    "createWebGLStaticRunKey",
    "createWebGLTextTextureKey",
    "defaultWebGLCurveSegments",
    "drawWebGLTextTexture",
    "emitWebGLShapePathFillFallbacks",
    "estimateWebGLSpriteTextureBinds",
    "extendStrokePoint",
    "finalizeWebGLRenderStats",
    "getPointLength",
    "getRoundStrokeStepCount",
    "getStrokeArcDelta",
    "getStrokeSegment",
    "getStrokeSegments",
    "getStrokeStyle",
    "getWebGLBounds",
    "getWebGLMaterialKey",
    "getWebGLRenderRunKind",
    "getWebGLShapePathFillMaterialKey",
    "getWebGLShapePathFillSupport",
    "getWebGLShapePathFillVertexCount",
    "getWebGLShapePathStrokeMaterialKey",
    "getWebGLShapePathStrokeVertexCount",
    "getWebGLShapePathUnsupportedFillCount",
    "getWebGLShapePathVertexCount",
    "getWebGLSpriteUV",
    "getWebGLStrokeVertexCount",
    "isClosedStrokePath",
    "isWebGL2Available",
    "isWebGLShape",
    "measureWebGLTextMetrics",
    "minimumWebGLCurveSegments",
    "offsetStrokePoint",
    "parseWebGLColor",
    "resolveWebGLCurveSegments",
    "shouldRasterizeShapePath",
    "sortWebGLSpritesForBatching",
    "trackWebGLRunModeStats",
    "trackWebGLShapeBatchStats",
    "trackWebGLSpriteBatchStats",
    "trackWebGLSpriteRunDiagnostics",
    "trackWebGLUploadStats",
    "triangulateWebGLPolygon",
    "webGLRoundStrokeSegments",
    "writeWebGLShapePathFill",
    "writeWebGLShapePathStroke"
  ].sort();
}
