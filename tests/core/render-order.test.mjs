import assert from "node:assert/strict";
import test from "node:test";
import { Rect, sortRenderObjects } from "raw2d-core";

test("Object2D stores zIndex and can update it", () => {
  const rect = new Rect({ width: 20, height: 20, zIndex: 4 });

  assert.equal(rect.zIndex, 4);

  rect.setZIndex(-2);

  assert.equal(rect.zIndex, -2);
});

test("sortRenderObjects sorts by zIndex without mutating input", () => {
  const back = new Rect({ name: "back", width: 20, height: 20, zIndex: -1 });
  const middle = new Rect({ name: "middle", width: 20, height: 20 });
  const front = new Rect({ name: "front", width: 20, height: 20, zIndex: 5 });
  const objects = [middle, front, back];

  const sorted = sortRenderObjects({ objects });

  assert.deepEqual(sorted.map((object) => object.name), ["back", "middle", "front"]);
  assert.deepEqual(objects.map((object) => object.name), ["middle", "front", "back"]);
});

test("sortRenderObjects preserves insertion order for matching zIndex", () => {
  const first = new Rect({ name: "first", width: 20, height: 20, zIndex: 1 });
  const second = new Rect({ name: "second", width: 20, height: 20, zIndex: 1 });
  const third = new Rect({ name: "third", width: 20, height: 20, zIndex: 1 });

  const sorted = sortRenderObjects({ objects: [first, second, third] });

  assert.deepEqual(sorted.map((object) => object.name), ["first", "second", "third"]);
});
