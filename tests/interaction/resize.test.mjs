import assert from "node:assert/strict";
import test from "node:test";
import { Rect } from "raw2d-core";
import { endObjectResize, startObjectResize, updateObjectResize } from "raw2d-interaction";

test("right handle resizes rect width", () => {
  const rect = new Rect({ x: 10, y: 20, width: 100, height: 60 });
  const state = startObjectResize({ object: rect, handleName: "right", pointerX: 110, pointerY: 50 });

  updateObjectResize({ state, pointerX: 140, pointerY: 50 });

  assert.equal(rect.x, 10);
  assert.equal(rect.width, 130);
  assert.equal(rect.height, 60);
});

test("bottom-right handle resizes rect width and height", () => {
  const rect = new Rect({ x: 10, y: 20, width: 100, height: 60 });
  const state = startObjectResize({ object: rect, handleName: "bottom-right", pointerX: 110, pointerY: 80 });

  updateObjectResize({ state, pointerX: 135, pointerY: 95 });

  assert.equal(rect.width, 125);
  assert.equal(rect.height, 75);
});

test("left handle keeps right edge fixed while resizing", () => {
  const rect = new Rect({ x: 10, y: 20, width: 100, height: 60 });
  const state = startObjectResize({ object: rect, handleName: "left", pointerX: 10, pointerY: 50 });

  updateObjectResize({ state, pointerX: 30, pointerY: 50 });

  assert.equal(rect.x, 30);
  assert.equal(rect.width, 80);
});

test("top-left handle clamps to minimum size", () => {
  const rect = new Rect({ x: 10, y: 20, width: 100, height: 60 });
  const state = startObjectResize({ object: rect, handleName: "top-left", pointerX: 10, pointerY: 20, minWidth: 30, minHeight: 25 });

  updateObjectResize({ state, pointerX: 200, pointerY: 120 });

  assert.equal(rect.x, 80);
  assert.equal(rect.y, 55);
  assert.equal(rect.width, 30);
  assert.equal(rect.height, 25);
});

test("ended resize ignores later updates", () => {
  const rect = new Rect({ x: 10, y: 20, width: 100, height: 60 });
  const state = startObjectResize({ object: rect, handleName: "right", pointerX: 110, pointerY: 50 });

  endObjectResize({ state });
  updateObjectResize({ state, pointerX: 160, pointerY: 50 });

  assert.equal(state.active, false);
  assert.equal(rect.width, 100);
});
