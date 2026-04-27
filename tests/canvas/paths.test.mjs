import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Polygon, Polyline } from "raw2d-core";
import { drawPolygon, drawPolyline } from "raw2d-canvas";

test("drawPolyline strokes an open multi-point path", () => {
  const context = createFakeContext();
  const polyline = new Polyline({
    x: 10,
    y: 20,
    points: [
      { x: 0, y: 10 },
      { x: 50, y: 0 },
      { x: 90, y: 30 }
    ],
    material: new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 6 })
  });

  drawPolyline({ context, polyline });

  assert.deepEqual(context.calls.slice(0, 4), ["save", "translate:10,20", "rotate:0", "scale:1,1"]);
  assert.ok(context.calls.includes("moveTo:0,10"));
  assert.ok(context.calls.includes("lineTo:50,0"));
  assert.ok(context.calls.includes("lineTo:90,30"));
  assert.ok(context.calls.includes("stroke:#38bdf8:6"));
  assert.equal(context.calls.includes("closePath"), false);
  assert.equal(context.calls.at(-1), "restore");
});

test("drawPolygon closes, fills, and strokes a point path", () => {
  const context = createFakeContext();
  const polygon = new Polygon({
    points: [
      { x: 80, y: 0 },
      { x: 260, y: 70 },
      { x: 40, y: 160 }
    ],
    material: new BasicMaterial({ fillColor: "#22c55e", strokeColor: "#bbf7d0", lineWidth: 3 })
  });

  drawPolygon({ context, polygon });

  assert.ok(context.calls.includes("moveTo:80,0"));
  assert.ok(context.calls.includes("lineTo:260,70"));
  assert.ok(context.calls.includes("lineTo:40,160"));
  assert.ok(context.calls.includes("closePath"));
  assert.ok(context.calls.includes("fill:#22c55e"));
  assert.ok(context.calls.includes("stroke:#bbf7d0:3"));
});

function createFakeContext() {
  const context = {
    calls: [],
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    save() {
      this.calls.push("save");
    },
    restore() {
      this.calls.push("restore");
    },
    translate(x, y) {
      this.calls.push(`translate:${x},${y}`);
    },
    rotate(rotation) {
      this.calls.push(`rotate:${rotation}`);
    },
    scale(x, y) {
      this.calls.push(`scale:${x},${y}`);
    },
    beginPath() {
      this.calls.push("beginPath");
    },
    moveTo(x, y) {
      this.calls.push(`moveTo:${x},${y}`);
    },
    lineTo(x, y) {
      this.calls.push(`lineTo:${x},${y}`);
    },
    closePath() {
      this.calls.push("closePath");
    },
    fill() {
      this.calls.push(`fill:${this.fillStyle}`);
    },
    stroke() {
      this.calls.push(`stroke:${this.strokeStyle}:${this.lineWidth}`);
    }
  };

  return context;
}
