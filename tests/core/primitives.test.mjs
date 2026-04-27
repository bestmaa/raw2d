import assert from "node:assert/strict";
import test from "node:test";
import {
  Arc,
  BasicMaterial,
  Ellipse,
  getArcLocalBounds,
  getCoreLocalBounds,
  getEllipseLocalBounds,
  getWorldBounds
} from "raw2d-core";

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

function rectangleSnapshot(rectangle) {
  return {
    x: rectangle.x,
    y: rectangle.y,
    width: rectangle.width,
    height: rectangle.height
  };
}
