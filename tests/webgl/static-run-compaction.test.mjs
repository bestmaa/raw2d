import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import { WebGLRenderer2D, compactWebGLStaticRuns } from "raw2d-webgl";
import { createFakeCanvas, createFakeWebGL2Context, createTexture } from "./texture-stats-utils.mjs";

test("compactWebGLStaticRuns merges adjacent static shape runs", () => {
  const first = createRenderItem(new Rect({ width: 10, height: 10 }), 0);
  const second = createRenderItem(new Rect({ width: 20, height: 10 }), 1);
  const sprite = createRenderItem(new Sprite({ texture: createTexture(8, 8), width: 8, height: 8 }), 2);

  const result = compactWebGLStaticRuns({
    runs: [
      { kind: "shape", mode: "static", items: [first] },
      { kind: "shape", mode: "static", items: [second] },
      { kind: "sprite", mode: "static", items: [sprite] }
    ]
  });

  assert.equal(result.inputRuns, 3);
  assert.equal(result.outputRuns, 2);
  assert.equal(result.compactedRuns, 1);
  assert.equal(result.mergedStaticObjects, 1);
  assert.deepEqual(result.runs[0].items.map((item) => item.id), [0, 1]);
  assert.equal(result.runs[1].kind, "sprite");
});

test("compactWebGLStaticRuns keeps dynamic, sprite, and unsupported boundaries visible", () => {
  const first = createRenderItem(new Rect({ width: 10, height: 10 }), 0);
  const second = createRenderItem(new Rect({ width: 20, height: 10 }), 1);
  const sprite = createRenderItem(new Sprite({ texture: createTexture(8, 8), width: 8, height: 8 }), 2);

  const result = compactWebGLStaticRuns({
    runs: [
      { kind: "shape", mode: "static", items: [first] },
      { kind: "shape", mode: "dynamic", items: [second] },
      { kind: "sprite", mode: "static", items: [sprite] },
      { kind: "unsupported", mode: "static", items: [first] }
    ]
  });

  assert.equal(result.outputRuns, 4);
  assert.equal(result.compactedRuns, 0);
  assert.deepEqual(result.runs.map((run) => run.kind), ["shape", "shape", "sprite", "unsupported"]);
});

test("WebGLRenderer2D keeps compacted static shape batches cache-visible", () => {
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(createFakeWebGL2Context()),
    width: 100,
    height: 100
  });
  const material = new BasicMaterial({ fillColor: "#35c2ff" });
  const first = new Rect({ x: 4, y: 4, width: 12, height: 12, material });
  const second = new Rect({ x: 20, y: 4, width: 12, height: 12, material });
  const scene = new Scene();

  first.setRenderMode("static");
  second.setRenderMode("static");
  scene.add(first).add(second);

  renderer.render(scene, new Camera2D());
  assert.equal(renderer.getStats().drawCalls, 1);
  assert.equal(renderer.getStats().staticCacheMisses, 1);

  renderer.render(scene, new Camera2D());
  const stats = renderer.getStats();

  assert.equal(stats.drawCalls, 1);
  assert.equal(stats.staticCacheHits, 1);
  assert.equal(stats.staticBatches, 1);
  assert.equal(stats.staticObjects, 2);
});

function createRenderItem(object, id) {
  return {
    id,
    object,
    worldMatrix: object.getWorldMatrix(),
    opacity: 1,
    visible: true
  };
}
