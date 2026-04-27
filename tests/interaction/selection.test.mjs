import assert from "node:assert/strict";
import test from "node:test";
import { Circle, Rect } from "raw2d-core";
import { SelectionManager, getSelectionBounds } from "raw2d-interaction";

test("selection manager selects and replaces objects", () => {
  const first = new Rect({ x: 0, y: 0, width: 20, height: 20 });
  const second = new Circle({ x: 50, y: 50, radius: 10 });
  const selection = new SelectionManager();

  selection.select(first);
  selection.select(second);

  assert.deepEqual(selection.getSelected(), [second]);
  assert.equal(selection.getPrimary(), second);
  assert.equal(selection.isSelected(first), false);
});

test("selection manager appends, toggles, and removes objects", () => {
  const first = new Rect({ x: 0, y: 0, width: 20, height: 20 });
  const second = new Circle({ x: 50, y: 50, radius: 10 });
  const selection = new SelectionManager();

  selection.select(first);
  selection.select(second, { append: true });
  selection.toggle(first);

  assert.deepEqual(selection.getSelected(), [second]);
  assert.equal(selection.isSelected(first), false);

  selection.remove(second);
  assert.deepEqual(selection.getSelected(), []);
});

test("selection manager returns immutable snapshot data", () => {
  const first = new Rect({ x: 0, y: 0, width: 20, height: 20 });
  const selection = new SelectionManager({ objects: [first] });
  const snapshot = selection.getSnapshot();

  selection.clear();

  assert.deepEqual(snapshot.objects, [first]);
  assert.equal(snapshot.primary, first);
  assert.deepEqual(selection.getSelected(), []);
});

test("getSelectionBounds merges selected object world bounds", () => {
  const rect = new Rect({ x: 10, y: 20, width: 40, height: 30 });
  const circle = new Circle({ x: 100, y: 80, radius: 20 });
  const bounds = getSelectionBounds({ objects: [rect, circle] });

  assert.ok(bounds);
  assert.equal(bounds.x, 10);
  assert.equal(bounds.y, 20);
  assert.equal(bounds.width, 110);
  assert.equal(bounds.height, 80);
});

test("getSelectionBounds returns null for empty selection", () => {
  assert.equal(getSelectionBounds({ objects: [] }), null);
});
