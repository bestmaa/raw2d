import assert from "node:assert/strict";
import test from "node:test";
import { Rectangle } from "raw2d-core";
import { getResizeHandles, pickResizeHandle } from "raw2d-interaction";

test("getResizeHandles returns eight handles around bounds", () => {
  const bounds = new Rectangle({ x: 10, y: 20, width: 100, height: 60 });
  const handles = getResizeHandles({ bounds, size: 10 });

  assert.equal(handles.length, 8);
  assert.deepEqual(
    handles.map((handle) => handle.name),
    ["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]
  );
});

test("getResizeHandles centers handles on corners and edges", () => {
  const bounds = new Rectangle({ x: 10, y: 20, width: 100, height: 60 });
  const handles = getResizeHandles({ bounds, size: 10 });
  const topLeft = handles[0];
  const right = handles[3];
  const bottom = handles[5];

  assert.deepEqual(toPlainHandle(topLeft), { name: "top-left", x: 5, y: 15, width: 10, height: 10, cursor: "nwse-resize" });
  assert.deepEqual(toPlainHandle(right), { name: "right", x: 105, y: 45, width: 10, height: 10, cursor: "ew-resize" });
  assert.deepEqual(toPlainHandle(bottom), { name: "bottom", x: 55, y: 75, width: 10, height: 10, cursor: "ns-resize" });
});

test("pickResizeHandle returns the handle under a point", () => {
  const bounds = new Rectangle({ x: 10, y: 20, width: 100, height: 60 });
  const handles = getResizeHandles({ bounds, size: 10 });

  assert.equal(pickResizeHandle({ handles, x: 10, y: 20 })?.name, "top-left");
  assert.equal(pickResizeHandle({ handles, x: 110, y: 50 })?.name, "right");
  assert.equal(pickResizeHandle({ handles, x: 70, y: 60 }), null);
});

function toPlainHandle(handle) {
  return {
    name: handle.name,
    x: handle.x,
    y: handle.y,
    width: handle.width,
    height: handle.height,
    cursor: handle.cursor
  };
}
