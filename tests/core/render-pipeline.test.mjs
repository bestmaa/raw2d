import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Group2D, Rect, Rectangle, RenderPipeline, Scene } from "raw2d-core";

test("RenderPipeline creates sorted root items and flat metadata", () => {
  const scene = new Scene();
  const back = new Rect({ name: "back", width: 20, height: 20, zIndex: -1 });
  const front = new Rect({ name: "front", width: 20, height: 20, zIndex: 10 });
  const pipeline = new RenderPipeline();

  scene.add(front);
  scene.add(back);

  const renderList = pipeline.build({ scene });

  assert.deepEqual(renderList.getRootItems().map((item) => item.object.name), ["back", "front"]);
  assert.deepEqual(renderList.getFlatItems().map((item) => item.order), [0, 1]);
  assert.deepEqual(renderList.getStats(), {
    total: 2,
    accepted: 2,
    hidden: 0,
    filtered: 0,
    culled: 0
  });
});

test("RenderPipeline preserves Group2D child hierarchy", () => {
  const scene = new Scene();
  const group = new Group2D({ name: "group" });
  const front = new Rect({ name: "front", width: 20, height: 20, zIndex: 4 });
  const back = new Rect({ name: "back", width: 20, height: 20, zIndex: -4 });
  const pipeline = new RenderPipeline();

  group.add(front);
  group.add(back);
  scene.add(group);

  const [groupItem] = pipeline.build({ scene }).getRootItems();

  assert.equal(groupItem.object, group);
  assert.deepEqual(groupItem.children.map((item) => item.object.name), ["back", "front"]);
  assert.deepEqual(groupItem.children.map((item) => item.parentId), [group.id, group.id]);
});

test("RenderPipeline filters hidden, custom-filtered, and culled objects", () => {
  const scene = new Scene();
  const camera = new Camera2D();
  const visible = new Rect({ name: "visible", x: 20, y: 20, width: 50, height: 50 });
  const outside = new Rect({ name: "outside", x: 900, y: 20, width: 50, height: 50 });
  const hidden = new Rect({ name: "hidden", width: 50, height: 50, visible: false });
  const filtered = new Rect({ name: "filtered", width: 50, height: 50 });
  const pipeline = new RenderPipeline({
    boundsProvider: (object) => new Rectangle({ x: object.x, y: object.y, width: 50, height: 50 })
  });

  scene.add(outside);
  scene.add(hidden);
  scene.add(filtered);
  scene.add(visible);

  const renderList = pipeline.build({
    scene,
    camera,
    viewport: { width: 200, height: 120 },
    culling: true,
    filter: (object) => object.name !== "filtered"
  });

  assert.deepEqual(renderList.getObjects(), [visible]);
  assert.deepEqual(renderList.getStats(), {
    total: 4,
    accepted: 1,
    hidden: 1,
    filtered: 1,
    culled: 1
  });
});

