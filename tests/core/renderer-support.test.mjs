import assert from "node:assert/strict";
import test from "node:test";
import { getRendererSupport, getRendererSupportMatrix } from "raw2d-core";

test("renderer support matrix exposes current object coverage", () => {
  const matrix = getRendererSupportMatrix();
  const byKind = new Map(matrix.map((entry) => [entry.kind, entry]));

  assert.equal(byKind.get("Rect").canvas, "supported");
  assert.equal(byKind.get("Rect").webgl, "supported");
  assert.equal(byKind.get("Arc").canvas, "supported");
  assert.equal(byKind.get("Arc").webgl, "supported");
  assert.equal(byKind.get("ShapePath").webgl, "partial");
  assert.equal(byKind.get("ShapePath").priority, "medium");
  assert.match(byKind.get("ShapePath").limitation, /rasterize fallback/);
  assert.match(byKind.get("ShapePath").nextStep, /GPU fill/);
  assert.equal(byKind.get("Polygon").webgl, "supported");
  assert.equal(byKind.get("Text2D").webgl, "partial");
  assert.equal(byKind.get("Text2D").priority, "medium");
});

test("renderer support matrix uses stable unique object kinds", () => {
  const matrix = getRendererSupportMatrix();
  const names = matrix.map((entry) => entry.kind);

  assert.equal(new Set(names).size, names.length);
  assert.deepEqual(names.toSorted(), [
    "Arc",
    "Circle",
    "Ellipse",
    "Group2D",
    "Line",
    "Polygon",
    "Polyline",
    "Rect",
    "ShapePath",
    "Sprite",
    "Text2D"
  ]);
});

test("renderer support profile exposes object support by renderer", () => {
  const canvas = getRendererSupport("canvas");
  const webgl = getRendererSupport("webgl");

  assert.equal(canvas.renderer, "canvas");
  assert.equal(canvas.objects.ShapePath, "supported");
  assert.equal(webgl.renderer, "webgl");
  assert.equal(webgl.objects.ShapePath, "partial");
  assert.equal(webgl.objects.Text2D, "partial");
  assert.match(webgl.notes.Text2D, /rasterizes/);
});
