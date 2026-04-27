import assert from "node:assert/strict";
import test from "node:test";
import { Rect } from "raw2d-core";
import { endObjectDrag, startObjectDrag, updateObjectDrag } from "raw2d-interaction";

test("object drag moves an object by pointer delta", () => {
  const rect = new Rect({ x: 20, y: 30, width: 80, height: 40 });
  const state = startObjectDrag({ object: rect, pointerX: 100, pointerY: 120 });

  updateObjectDrag({ state, pointerX: 130, pointerY: 150 });

  assert.equal(rect.x, 50);
  assert.equal(rect.y, 60);
});

test("object drag uses the initial object position for every update", () => {
  const rect = new Rect({ x: 20, y: 30, width: 80, height: 40 });
  const state = startObjectDrag({ object: rect, pointerX: 100, pointerY: 120 });

  updateObjectDrag({ state, pointerX: 130, pointerY: 150 });
  updateObjectDrag({ state, pointerX: 110, pointerY: 125 });

  assert.equal(rect.x, 30);
  assert.equal(rect.y, 35);
});

test("ended object drag ignores later updates", () => {
  const rect = new Rect({ x: 20, y: 30, width: 80, height: 40 });
  const state = startObjectDrag({ object: rect, pointerX: 100, pointerY: 120 });

  endObjectDrag({ state });
  updateObjectDrag({ state, pointerX: 150, pointerY: 170 });

  assert.equal(state.active, false);
  assert.equal(rect.x, 20);
  assert.equal(rect.y, 30);
});
