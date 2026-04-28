import assert from "node:assert/strict";
import test from "node:test";
import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect, ShapePath, getRendererSupportMatrix } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { getWebGLRenderRunKind } from "raw2d-webgl";

test("WebGL support matrix matches render run classification", () => {
  for (const entry of getRendererSupportMatrix()) {
    const object = createObject(entry.kind);

    if (!object) {
      continue;
    }

    const expected = entry.webgl === "unsupported" ? "unsupported" : getExpectedRunKind(entry.kind);
    assert.equal(getWebGLRenderRunKind(object), expected, entry.kind);
  }
});

function getExpectedRunKind(kind) {
  return kind === "Sprite" || kind === "Text2D" ? "sprite" : "shape";
}

function createObject(kind) {
  const texture = new Texture({ source: { width: 4, height: 4 }, width: 4, height: 4 });

  return {
    Arc: new Arc({ x: 0, y: 0, radiusX: 10, radiusY: 10, startAngle: 0, endAngle: 1 }),
    Circle: new Circle({ x: 0, y: 0, radius: 10 }),
    Ellipse: new Ellipse({ x: 0, y: 0, radiusX: 10, radiusY: 5 }),
    Line: new Line({ x: 0, y: 0, endX: 10, endY: 10 }),
    Polygon: new Polygon({ points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }] }),
    Polyline: new Polyline({ points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] }),
    Rect: new Rect({ x: 0, y: 0, width: 10, height: 10 }),
    ShapePath: new ShapePath(),
    Sprite: new Sprite({ texture }),
    Text2D: new Text2D({ text: "Raw2D" })
  }[kind] ?? null;
}
