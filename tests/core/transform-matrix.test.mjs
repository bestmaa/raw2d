import assert from "node:assert/strict";
import test from "node:test";
import { Group2D, Rect, RenderPipeline } from "raw2d-core";

test("Object2D matrix cache becomes dirty when transform changes", () => {
  const rect = new Rect({ x: 10, y: 20, width: 40, height: 30 });

  rect.updateMatrix();
  assert.deepEqual(rect.getMatrixState(), {
    localMatrixDirty: false,
    worldMatrixDirty: true
  });

  rect.x = 30;

  assert.deepEqual(rect.getMatrixState(), {
    localMatrixDirty: true,
    worldMatrixDirty: true
  });
});

test("Object2D updates world matrix from parent matrix", () => {
  const group = new Group2D({ x: 100, y: 50 });
  const rect = new Rect({ x: 20, y: 10, width: 40, height: 30 });

  group.updateWorldMatrix();
  rect.updateWorldMatrix(group.getWorldMatrix());

  assert.deepEqual(rect.getWorldMatrix().transformPoint({ x: 0, y: 0 }), { x: 120, y: 60 });
});

test("RenderPipeline stores matrix snapshots on render items", () => {
  const group = new Group2D({ x: 100, y: 50 });
  const rect = new Rect({ x: 20, y: 10, width: 40, height: 30 });
  const pipeline = new RenderPipeline();

  group.add(rect);

  const renderList = pipeline.build({ objects: [group] });
  const item = renderList.getFlatItems().find((entry) => entry.object === rect);

  assert.ok(item);
  assert.deepEqual(item.worldMatrix.transformPoint({ x: 0, y: 0 }), { x: 120, y: 60 });
});

