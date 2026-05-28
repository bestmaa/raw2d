import assert from "node:assert/strict";
import test from "node:test";
import { Circle, Group2D, Line, Rect, Scene, Sprite, Text2D, Texture } from "raw2d";
import { createRaw2DFiberHostConfig } from "raw2d-react-fiber";

test("raw2d-react-fiber host config creates supported objects", () => {
  const config = createRaw2DFiberHostConfig();
  const texture = createTexture();

  assert.ok(config.createInstance("rawRect", { width: 12, height: 8 }).object instanceof Rect);
  assert.ok(config.createInstance("rawCircle", { radius: 10 }).object instanceof Circle);
  assert.ok(config.createInstance("rawLine", { endX: 20, endY: 4 }).object instanceof Line);
  assert.ok(config.createInstance("rawText2D", { text: "Fiber" }).object instanceof Text2D);
  assert.ok(config.createInstance("rawSprite", { texture }).object instanceof Sprite);
  assert.ok(config.createInstance("rawGroup2D", { name: "group" }).object instanceof Group2D);
});

test("raw2d-react-fiber host config updates geometry and material props", () => {
  const config = createRaw2DFiberHostConfig();
  const rect = config.createInstance("rawRect", { width: 12, height: 8, fillColor: "#111111" });

  config.commitUpdate(rect, {
    width: 24,
    height: 16,
    fillColor: "#35c2ff",
    lineWidth: 4,
    name: "updated",
    x: 8,
    y: 12
  });

  assert.ok(rect.object instanceof Rect);
  assert.equal(rect.object.width, 24);
  assert.equal(rect.object.height, 16);
  assert.equal(rect.object.material.fillColor, "#35c2ff");
  assert.equal(rect.object.material.lineWidth, 4);
  assert.equal(rect.object.name, "updated");
  assert.equal(rect.object.x, 8);
  assert.equal(rect.object.y, 12);
});

test("raw2d-react-fiber host config updates text, sprite, circle, and line props", () => {
  const config = createRaw2DFiberHostConfig();
  const texture = createTexture();
  const nextTexture = createTexture(32, 20);
  const text = config.createInstance("rawText2D", { text: "Old" });
  const sprite = config.createInstance("rawSprite", { texture, opacity: 0.5 });
  const circle = config.createInstance("rawCircle", { radius: 8 });
  const line = config.createInstance("rawLine", { endX: 4, endY: 5 });

  config.commitUpdate(text, { text: "New", font: "18px serif", align: "center", baseline: "middle" });
  config.commitUpdate(sprite, { texture: nextTexture, width: 48, height: 30, opacity: 0.75 });
  config.commitUpdate(circle, { radius: 14, strokeColor: "#f45b69" });
  config.commitUpdate(line, { startX: 1, startY: 2, endX: 8, endY: 9, lineWidth: 3 });

  assert.ok(text.object instanceof Text2D);
  assert.equal(text.object.text, "New");
  assert.equal(text.object.font, "18px serif");
  assert.equal(text.object.align, "center");
  assert.equal(text.object.baseline, "middle");

  assert.ok(sprite.object instanceof Sprite);
  assert.equal(sprite.object.texture, nextTexture);
  assert.equal(sprite.object.width, 48);
  assert.equal(sprite.object.height, 30);
  assert.equal(sprite.object.opacity, 0.75);

  assert.ok(circle.object instanceof Circle);
  assert.equal(circle.object.radius, 14);
  assert.equal(circle.object.material.strokeColor, "#f45b69");

  assert.ok(line.object instanceof Line);
  assert.deepEqual(line.object.getPoints(), { startX: 1, startY: 2, endX: 8, endY: 9 });
  assert.equal(line.object.material.lineWidth, 3);
});

test("raw2d-react-fiber host config appends and removes scene children", () => {
  const config = createRaw2DFiberHostConfig();
  const scene = new Scene();
  const group = config.createInstance("rawGroup2D", { name: "layer" });
  const rect = config.createInstance("rawRect", { width: 10, height: 10 });

  config.appendChild(scene, group);
  config.appendChild(group, rect);

  assert.deepEqual(scene.getObjects(), [group.object]);
  assert.ok(group.object instanceof Group2D);
  assert.deepEqual(group.object.getChildren(), [rect.object]);

  config.removeChild(group, rect);
  config.removeChild(scene, group);

  assert.deepEqual(group.object.getChildren(), []);
  assert.deepEqual(scene.getObjects(), []);
});

function createTexture(width = 16, height = 16) {
  return new Texture({ source: { width, height }, width, height });
}
