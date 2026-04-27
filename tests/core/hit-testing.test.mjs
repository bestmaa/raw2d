import assert from "node:assert/strict";
import test from "node:test";
import {
  Circle,
  Ellipse,
  Line,
  Object2D,
  Polygon,
  Polyline,
  Rect,
  Scene,
  ShapePath,
  containsPoint,
  getRectLocalBounds,
  pickObject,
  worldToLocalPoint
} from "raw2d-core";

test("containsPoint checks Rect in world coordinates with origin and scale", () => {
  const rect = new Rect({ x: 100, y: 80, width: 40, height: 20, origin: "center" });
  rect.setScale(2, 2);

  assert.equal(containsPoint({ object: rect, x: 100, y: 80 }), true);
  assert.equal(containsPoint({ object: rect, x: 139, y: 99 }), true);
  assert.equal(containsPoint({ object: rect, x: 142, y: 102 }), false);
});

test("worldToLocalPoint reverses object transform", () => {
  const rect = new Rect({ x: 100, y: 80, width: 40, height: 20, origin: "center" });
  rect.setScale(2, 2);
  const point = worldToLocalPoint({ object: rect, localBounds: getRectLocalBounds(rect), x: 100, y: 80 });

  assert.deepEqual(roundPoint(point), { x: 20, y: 10 });
});

test("containsPoint checks Circle and Ellipse", () => {
  const circle = new Circle({ x: 50, y: 50, radius: 20 });
  const ellipse = new Ellipse({ x: 100, y: 100, radiusX: 40, radiusY: 20 });

  assert.equal(containsPoint({ object: circle, x: 50, y: 50 }), true);
  assert.equal(containsPoint({ object: circle, x: 75, y: 50 }), false);
  assert.equal(containsPoint({ object: ellipse, x: 130, y: 100 }), true);
  assert.equal(containsPoint({ object: ellipse, x: 100, y: 125 }), false);
});

test("containsPoint checks Line and Polyline with tolerance", () => {
  const line = new Line({ startX: 0, startY: 0, endX: 100, endY: 0 });
  const polyline = new Polyline({
    points: [
      { x: 0, y: 0 },
      { x: 80, y: 0 },
      { x: 80, y: 80 }
    ]
  });

  assert.equal(containsPoint({ object: line, x: 50, y: 2, tolerance: 3 }), true);
  assert.equal(containsPoint({ object: line, x: 50, y: 8, tolerance: 3 }), false);
  assert.equal(containsPoint({ object: polyline, x: 40, y: 2, tolerance: 4 }), true);
  assert.equal(containsPoint({ object: polyline, x: 120, y: 20, tolerance: 4 }), false);
});

test("containsPoint checks Polygon fill", () => {
  const polygon = new Polygon({
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 50, y: 80 }
    ]
  });

  assert.equal(containsPoint({ object: polygon, x: 50, y: 20 }), true);
  assert.equal(containsPoint({ object: polygon, x: 90, y: 70 }), false);
});

test("containsPoint uses conservative bounds for ShapePath", () => {
  const shapePath = new ShapePath();
  shapePath.moveTo(0, 0).quadraticCurveTo(80, -30, 120, 60).closePath();

  assert.equal(containsPoint({ object: shapePath, x: 80, y: 10 }), true);
  assert.equal(containsPoint({ object: shapePath, x: 140, y: -20 }), false);
});

test("pickObject returns the topmost visible hit object", () => {
  const scene = new Scene();
  const bottom = new Rect({ name: "bottom", x: 0, y: 0, width: 100, height: 100 });
  const top = new Circle({ name: "top", x: 50, y: 50, radius: 40 });

  scene.add(bottom);
  scene.add(top);

  assert.equal(pickObject({ scene, x: 50, y: 50 }), top);
  assert.equal(pickObject({ scene, x: 50, y: 50, topmost: false }), bottom);
});

test("pickObject skips hidden and unsupported objects", () => {
  const scene = new Scene();
  const unsupported = new Object2D({ x: 0, y: 0 });
  const hidden = new Rect({ x: 0, y: 0, width: 100, height: 100, visible: false });
  const visible = new Rect({ x: 0, y: 0, width: 80, height: 80 });

  scene.add(unsupported);
  scene.add(hidden);
  scene.add(visible);

  assert.equal(pickObject({ scene, x: 20, y: 20 }), visible);
  assert.equal(pickObject({ scene, x: 120, y: 120 }), null);
});

test("pickObject supports line tolerance and filters", () => {
  const scene = new Scene();
  const line = new Line({ name: "line", startX: 0, startY: 0, endX: 100, endY: 0 });

  scene.add(line);

  assert.equal(pickObject({ scene, x: 50, y: 5, tolerance: 6 }), line);
  assert.equal(
    pickObject({
      scene,
      x: 50,
      y: 5,
      tolerance: 6,
      filter: (object) => object.name !== "line"
    }),
    null
  );
});

function roundPoint(point) {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y)
  };
}
