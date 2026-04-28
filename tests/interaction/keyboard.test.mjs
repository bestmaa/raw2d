import assert from "node:assert/strict";
import test from "node:test";
import { Rect, Scene } from "raw2d-core";
import { KeyboardController, SelectionManager } from "raw2d-interaction";

function createTarget() {
  let keydown = null;

  return {
    addEventListener(type, listener) {
      if (type === "keydown") {
        keydown = listener;
      }
    },
    removeEventListener(type, listener) {
      if (type === "keydown" && keydown === listener) {
        keydown = null;
      }
    },
    dispatch(event) {
      keydown?.(event);
    },
    getListener() {
      return keydown;
    }
  };
}

test("keyboard controller moves selected objects with arrow keys", () => {
  const target = createTarget();
  const rect = new Rect({ x: 10, y: 20, width: 30, height: 40 });
  const selection = new SelectionManager({ objects: [rect] });
  const keyboard = new KeyboardController({ target, selection, moveStep: 2, fastMoveStep: 12 });

  keyboard.enableMove();
  keyboard.handleKeyDown({ key: "ArrowRight" });
  keyboard.handleKeyDown({ key: "ArrowDown", shiftKey: true });

  assert.equal(rect.x, 12);
  assert.equal(rect.y, 32);
  assert.deepEqual(keyboard.getSnapshot(), { selectedCount: 1, lastAction: "move" });
});

test("keyboard controller deletes selected objects from scene", () => {
  const target = createTarget();
  const scene = new Scene();
  const first = new Rect({ x: 10, y: 20, width: 30, height: 40 });
  const second = new Rect({ x: 80, y: 20, width: 30, height: 40 });
  const selection = new SelectionManager({ objects: [first, second] });
  const keyboard = new KeyboardController({ target, selection, scene });

  scene.add(first);
  scene.add(second);
  keyboard.enableDelete();
  keyboard.handleKeyDown({ key: "Delete" });

  assert.deepEqual(scene.getObjects(), []);
  assert.deepEqual(selection.getSelected(), []);
  assert.equal(keyboard.getSnapshot().lastAction, "delete");
});

test("keyboard controller clears selection with escape", () => {
  const target = createTarget();
  const rect = new Rect({ x: 10, y: 20, width: 30, height: 40 });
  const selection = new SelectionManager({ objects: [rect] });
  const keyboard = new KeyboardController({ target, selection });

  keyboard.enableClear();
  keyboard.handleKeyDown({ key: "Escape" });

  assert.deepEqual(selection.getSelected(), []);
  assert.equal(keyboard.getSnapshot().lastAction, "clear");
});

test("keyboard controller attaches and disposes target listener", () => {
  const target = createTarget();
  const selection = new SelectionManager();
  const keyboard = new KeyboardController({ target, selection });

  assert.equal(typeof target.getListener(), "function");

  keyboard.dispose();

  assert.equal(target.getListener(), null);
});
