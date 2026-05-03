import assert from "node:assert/strict";
import test from "node:test";
import * as CanvasPackage from "raw2d-canvas";

test("raw2d-canvas runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(CanvasPackage).sort(), getExpectedCanvasRuntimeExports());
});

test("raw2d-canvas exposes renderer tools without owning core objects", () => {
  assert.equal(typeof CanvasPackage.Canvas, "function");
  assert.equal(typeof CanvasPackage.CanvasRenderer, "function");
  assert.equal(CanvasPackage.Canvas, CanvasPackage.CanvasRenderer);
  assert.equal(typeof CanvasPackage.CanvasObjectRenderer, "function");
  assert.equal(typeof CanvasPackage.drawRect, "function");
  assert.equal(CanvasPackage.Scene, undefined);
  assert.equal(CanvasPackage.Rect, undefined);
  assert.equal(CanvasPackage.WebGLRenderer2D, undefined);
});

function getExpectedCanvasRuntimeExports() {
  return [
    "Canvas",
    "CanvasRenderer",
    "CanvasObjectRenderer",
    "applyObjectTransform",
    "applyOriginOffset",
    "applyStrokeStyle",
    "createCanvasObjectRenderHandlers",
    "drawArc",
    "drawCircle",
    "drawEllipse",
    "drawLine",
    "drawPolygon",
    "drawPolyline",
    "drawRect",
    "drawShapePath",
    "drawSprite",
    "drawText2D",
    "getCanvasObjectWorldBounds",
    "getVisibleCanvasObjects",
    "renderCanvasObject"
  ].sort();
}
