import assert from "node:assert/strict";
import test from "node:test";
import { Group2D, Rect } from "raw2d-core";

test("Group2D stores children without duplicates", () => {
  const group = new Group2D({ name: "panel", x: 20, y: 40 });
  const rect = new Rect({ width: 20, height: 20 });

  group.add(rect);
  group.add(rect);

  assert.equal(group.name, "panel");
  assert.equal(group.x, 20);
  assert.equal(group.y, 40);
  assert.deepEqual(group.getChildren(), [rect]);
});

test("Group2D removes and clears children", () => {
  const first = new Rect({ width: 20, height: 20 });
  const second = new Rect({ width: 20, height: 20 });
  const group = new Group2D({ children: [first, second] });

  group.remove(first);

  assert.deepEqual(group.getChildren(), [second]);

  group.clear();

  assert.deepEqual(group.getChildren(), []);
});

test("Group2D cannot add itself", () => {
  const group = new Group2D();

  assert.throws(() => group.add(group), /cannot add itself/);
});
