import assert from "node:assert/strict";
import test from "node:test";
import { getRendererSupportMatrix } from "raw2d-core";

test("renderer support matrix exposes current object coverage", () => {
  const matrix = getRendererSupportMatrix();
  const byKind = new Map(matrix.map((entry) => [entry.kind, entry]));

  assert.equal(byKind.get("Rect").canvas, "supported");
  assert.equal(byKind.get("Rect").webgl, "supported");
  assert.equal(byKind.get("Arc").canvas, "supported");
  assert.equal(byKind.get("Arc").webgl, "unsupported");
  assert.equal(byKind.get("ShapePath").webgl, "unsupported");
  assert.equal(byKind.get("Polygon").webgl, "partial");
  assert.equal(byKind.get("Text2D").webgl, "partial");
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
