import assert from "node:assert/strict";
import test from "node:test";
import { Arc, BasicMaterial, Ellipse } from "raw2d-core";
import { drawArc, drawEllipse } from "raw2d-canvas";

test("drawEllipse issues a Canvas ellipse fill with object transform", () => {
  const context = createFakeContext();
  const ellipse = new Ellipse({
    x: 20,
    y: 30,
    radiusX: 40,
    radiusY: 18,
    material: new BasicMaterial({ fillColor: "#a78bfa" })
  });

  drawEllipse({ context, ellipse });

  assert.deepEqual(context.calls.slice(0, 4), ["save", "translate:20,30", "rotate:0", "scale:1,1"]);
  assert.ok(context.calls.includes("ellipse:0,0,40,18,0,0,6.283185307179586,false"));
  assert.ok(context.calls.includes("fill:#a78bfa"));
  assert.equal(context.calls.at(-1), "restore");
});

test("drawArc strokes open arcs and fills closed arcs", () => {
  const openContext = createFakeContext();
  const openArc = new Arc({
    radiusX: 30,
    radiusY: 16,
    startAngle: 0,
    endAngle: Math.PI,
    material: new BasicMaterial({ strokeColor: "#f97316", lineWidth: 8 })
  });

  drawArc({ context: openContext, arc: openArc });
  assert.ok(openContext.calls.includes("stroke:#f97316:8"));
  assert.equal(openContext.calls.includes("fill:#f97316"), false);

  const closedContext = createFakeContext();
  const closedArc = new Arc({
    radiusX: 30,
    radiusY: 16,
    startAngle: 0,
    endAngle: Math.PI,
    closed: true,
    material: new BasicMaterial({ fillColor: "#f97316" })
  });

  drawArc({ context: closedContext, arc: closedArc });
  assert.ok(closedContext.calls.includes("lineTo:0,0"));
  assert.ok(closedContext.calls.includes("closePath"));
  assert.ok(closedContext.calls.includes("fill:#f97316"));
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
    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise = false) {
      this.calls.push(`ellipse:${x},${y},${radiusX},${radiusY},${rotation},${startAngle},${endAngle},${anticlockwise}`);
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
