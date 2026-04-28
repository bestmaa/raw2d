import assert from "node:assert/strict";
import test from "node:test";
import {
  Arc,
  BasicMaterial,
  Ellipse,
  Rect,
  getArcLocalBounds,
  getCoreLocalBounds,
  getEllipseLocalBounds,
  getPolygonLocalBounds,
  getPolylineLocalBounds,
  getShapePathLocalBounds,
  getWorldBounds
} from "raw2d-core";
import { Polygon, Polyline, ShapePath } from "raw2d-core";

test("Ellipse stores radii, clamps negative values, and defaults to center origin", () => {
  const ellipse = new Ellipse({ radiusX: -20, radiusY: 14 });

  assert.equal(ellipse.radiusX, 0);
  assert.equal(ellipse.radiusY, 14);
  assert.equal(ellipse.originX, 0.5);
  assert.equal(ellipse.originY, 0.5);
  assert.deepEqual(ellipse.getSize(), { radiusX: 0, radiusY: 14, width: 0, height: 28 });

  ellipse.setRadii(30, 12);
  assert.deepEqual(ellipse.getSize(), { radiusX: 30, radiusY: 12, width: 60, height: 24 });
});

test("Object2D render mode defaults to dynamic and can become static", () => {
  const rect = new Rect({ width: 20, height: 10 });

  assert.equal(rect.renderMode, "dynamic");

  rect.setRenderMode("static");
  assert.equal(rect.renderMode, "static");
});

test("Arc stores radii, angles, closed state, and material", () => {
  const material = new BasicMaterial({ strokeColor: "#f97316", lineWidth: 8 });
  const arc = new Arc({
    radiusX: 40,
    radiusY: 20,
    startAngle: 0,
    endAngle: Math.PI,
    material
  });

  assert.equal(arc.originX, 0.5);
  assert.equal(arc.originY, 0.5);
  assert.equal(arc.closed, false);
  assert.equal(arc.material, material);
  assert.deepEqual(arc.getAngles(), { startAngle: 0, endAngle: Math.PI, anticlockwise: false });

  arc.setAngles(1, 2, true);
  assert.deepEqual(arc.getAngles(), { startAngle: 1, endAngle: 2, anticlockwise: true });
});

test("Ellipse and Arc local bounds are conservative full-curve rectangles", () => {
  const ellipse = new Ellipse({ radiusX: 30, radiusY: 12 });
  const arc = new Arc({ radiusX: 40, radiusY: 20, startAngle: 0, endAngle: Math.PI });

  assert.deepEqual(rectangleSnapshot(getEllipseLocalBounds(ellipse)), { x: -30, y: -12, width: 60, height: 24 });
  assert.deepEqual(rectangleSnapshot(getArcLocalBounds(arc)), { x: -40, y: -20, width: 80, height: 40 });
  assert.deepEqual(rectangleSnapshot(getCoreLocalBounds(ellipse)), { x: -30, y: -12, width: 60, height: 24 });
  assert.deepEqual(rectangleSnapshot(getCoreLocalBounds(arc)), { x: -40, y: -20, width: 80, height: 40 });
});

test("World bounds apply position, scale, and origin", () => {
  const ellipse = new Ellipse({ x: 100, y: 80, radiusX: 30, radiusY: 10 });
  ellipse.setScale(2, 3);

  const bounds = getWorldBounds({ object: ellipse, localBounds: getEllipseLocalBounds(ellipse) });

  assert.deepEqual(rectangleSnapshot(bounds), { x: 40, y: 50, width: 120, height: 60 });
});

test("Polyline stores an open point list and computes local bounds", () => {
  const points = [
    { x: 0, y: 20 },
    { x: 40, y: -10 },
    { x: 120, y: 60 }
  ];
  const polyline = new Polyline({ points });

  points[0].x = 999;

  assert.deepEqual(polyline.getPoints(), [
    { x: 0, y: 20 },
    { x: 40, y: -10 },
    { x: 120, y: 60 }
  ]);
  assert.deepEqual(rectangleSnapshot(getPolylineLocalBounds(polyline)), { x: 0, y: -10, width: 120, height: 70 });
  assert.deepEqual(rectangleSnapshot(getCoreLocalBounds(polyline)), { x: 0, y: -10, width: 120, height: 70 });

  polyline.addPoint(-20, 10);
  assert.deepEqual(rectangleSnapshot(getPolylineLocalBounds(polyline)), { x: -20, y: -10, width: 140, height: 70 });
});

test("Polygon stores a closed point list and computes local bounds", () => {
  const material = new BasicMaterial({ fillColor: "#22c55e", strokeColor: "#bbf7d0", lineWidth: 3 });
  const polygon = new Polygon({
    points: [
      { x: 80, y: 0 },
      { x: 260, y: 70 },
      { x: 40, y: 160 }
    ],
    material
  });

  assert.equal(polygon.material, material);
  assert.deepEqual(rectangleSnapshot(getPolygonLocalBounds(polygon)), { x: 40, y: 0, width: 220, height: 160 });
  assert.deepEqual(rectangleSnapshot(getCoreLocalBounds(polygon)), { x: 40, y: 0, width: 220, height: 160 });

  polygon.setPoints([{ x: -10, y: -20 }, { x: 30, y: 40 }]);
  assert.deepEqual(rectangleSnapshot(getPolygonLocalBounds(polygon)), { x: -10, y: -20, width: 40, height: 60 });
});

test("ShapePath stores commands and computes conservative local bounds", () => {
  const shapePath = new ShapePath({ fill: true, stroke: true });

  shapePath
    .moveTo(0, 95)
    .quadraticCurveTo(260, 18, 300, 95)
    .bezierCurveTo(255, 190, 45, 190, 0, 95)
    .closePath();

  assert.equal(shapePath.commands.length, 4);
  assert.deepEqual(rectangleSnapshot(getShapePathLocalBounds(shapePath)), { x: 0, y: 18, width: 300, height: 172 });
  assert.deepEqual(rectangleSnapshot(getCoreLocalBounds(shapePath)), { x: 0, y: 18, width: 300, height: 172 });

  const commands = shapePath.getCommands();
  shapePath.clear();
  assert.equal(shapePath.commands.length, 0);
  shapePath.setCommands(commands);
  assert.equal(shapePath.commands.length, 4);
});

function rectangleSnapshot(rectangle) {
  return {
    x: rectangle.x,
    y: rectangle.y,
    width: rectangle.width,
    height: rectangle.height
  };
}
