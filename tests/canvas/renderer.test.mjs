import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Rect } from "raw2d-core";
import { CanvasObjectRenderer } from "raw2d-canvas";

test("CanvasObjectRenderer dispatches through handlers and skips invisible objects", () => {
  const context = createFakeContext();
  const renderer = new CanvasObjectRenderer({ context });
  const visibleRect = new Rect({
    x: 10,
    y: 20,
    width: 80,
    height: 40,
    material: new BasicMaterial({ fillColor: "#f45b69" })
  });
  const hiddenRect = new Rect({
    width: 20,
    height: 20,
    visible: false,
    material: new BasicMaterial({ fillColor: "#ffffff" })
  });

  renderer.render([visibleRect, hiddenRect]);

  assert.ok(context.calls.includes("fillRect:0,0,80,40:#f45b69"));
  assert.equal(context.calls.some((call) => call.includes("#ffffff")), false);
});

function createFakeContext() {
  const context = {
    calls: [],
    fillStyle: "",
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
    fillRect(x, y, width, height) {
      this.calls.push(`fillRect:${x},${y},${width},${height}:${this.fillStyle}`);
    }
  };

  return context;
}
