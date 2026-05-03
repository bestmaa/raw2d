import assert from "node:assert/strict";
import test from "node:test";
import * as Core from "raw2d-core";

test("raw2d-core runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(Core).sort(), getExpectedCoreRuntimeExports());
});

test("raw2d-core keeps renderer package internals out", () => {
  assert.equal(Core.Canvas, undefined);
  assert.equal(Core.CanvasObjectRenderer, undefined);
  assert.equal(Core.WebGLRenderer2D, undefined);
  assert.equal(Core.WebGLFloatBuffer, undefined);
  assert.equal(Core.Texture, undefined);
  assert.equal(Core.Sprite, undefined);
  assert.equal(Core.Text2D, undefined);
});

function getExpectedCoreRuntimeExports() {
  return [
    "Arc",
    "BasicMaterial",
    "Camera2D",
    "Circle",
    "Ellipse",
    "Group2D",
    "Line",
    "Matrix3",
    "Object2D",
    "Polygon",
    "Polyline",
    "Rect",
    "Rectangle",
    "RenderList",
    "RenderPipeline",
    "Scene",
    "ShapePath",
    "containsCirclePoint",
    "containsEllipsePoint",
    "containsLinePoint",
    "containsPoint",
    "containsPolygonPoint",
    "containsPolylinePoint",
    "containsRectPoint",
    "flattenPathCommands",
    "flattenShapePath",
    "getArcLocalBounds",
    "getCameraWorldBounds",
    "getCircleLocalBounds",
    "getCoreLocalBounds",
    "getEllipseLocalBounds",
    "getLineLocalBounds",
    "getPolygonLocalBounds",
    "getPolylineLocalBounds",
    "getRectLocalBounds",
    "getRendererSupport",
    "getRendererSupportMatrix",
    "getSegmentDistance",
    "getShapePathLocalBounds",
    "getVisibleObjects",
    "getWorldBounds",
    "pickObject",
    "rendererSupportMatrix",
    "resolveObject2DOrigin",
    "sortRenderObjects",
    "uid",
    "worldToLocalPoint"
  ].sort();
}
