import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Group2D, Rect } from "raw2d-core";
import { createBlurEffect, createGrayscaleEffect, createOpacityEffect, createShadowEffect } from "raw2d-effects";
import { CanvasObjectRenderer, applyCanvasEffects } from "raw2d-canvas";

test("applyCanvasEffects maps Raw2D effects to explicit Canvas state", () => {
  const context = createFakeContext();

  applyCanvasEffects({
    context,
    effects: [
      createOpacityEffect(0.5),
      createBlurEffect(4),
      createGrayscaleEffect(0.25),
      createShadowEffect({ color: "rgba(0,0,0,0.4)", blur: 8, offsetX: 2, offsetY: 3 })
    ]
  });

  assert.equal(context.globalAlpha, 0.5);
  assert.equal(context.filter, "blur(4px) grayscale(0.25)");
  assert.equal(context.shadowColor, "rgba(0,0,0,0.4)");
  assert.equal(context.shadowBlur, 8);
  assert.equal(context.shadowOffsetX, 2);
  assert.equal(context.shadowOffsetY, 3);
});

test("CanvasObjectRenderer scopes object effects around the draw call", () => {
  const context = createFakeContext();
  const renderer = new CanvasObjectRenderer({ context });
  const rect = new Rect({
    width: 32,
    height: 18,
    material: new BasicMaterial({ fillColor: "#35c2ff" })
  });

  renderer.render([rect], {
    effects: (object) => (object === rect ? [createOpacityEffect(0.4), createBlurEffect(3)] : [])
  });

  const alphaIndex = context.calls.indexOf("alpha:0.4");
  const filterIndex = context.calls.indexOf("filter:blur(3px)");
  const drawIndex = context.calls.indexOf("fillRect:0,0,32,18:#35c2ff:0.4:blur(3px)");

  assert.ok(alphaIndex > -1);
  assert.ok(filterIndex > alphaIndex);
  assert.ok(drawIndex > filterIndex);
});

test("CanvasObjectRenderer applies group effects to child drawing", () => {
  const context = createFakeContext();
  const renderer = new CanvasObjectRenderer({ context });
  const group = new Group2D({ x: 10, y: 12 });
  const child = new Rect({
    width: 20,
    height: 10,
    material: new BasicMaterial({ fillColor: "#f45b69" })
  });

  group.add(child);
  renderer.render([group], {
    effects: (object) => (object === group ? [createGrayscaleEffect(0.8)] : [])
  });

  const filterIndex = context.calls.indexOf("filter:grayscale(0.8)");
  const groupTranslateIndex = context.calls.indexOf("translate:10,12");
  const drawIndex = context.calls.indexOf("fillRect:0,0,20,10:#f45b69:1:grayscale(0.8)");

  assert.ok(filterIndex > -1);
  assert.ok(groupTranslateIndex > filterIndex);
  assert.ok(drawIndex > groupTranslateIndex);
});

function createFakeContext() {
  return {
    calls: [],
    fillStyle: "",
    shadowColor: "",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    _filter: "none",
    _globalAlpha: 1,
    get filter() {
      return this._filter;
    },
    set filter(value) {
      this._filter = value;
      this.calls.push(`filter:${value}`);
    },
    get globalAlpha() {
      return this._globalAlpha;
    },
    set globalAlpha(value) {
      this._globalAlpha = value;
      this.calls.push(`alpha:${value}`);
    },
    save() {
      this.calls.push("save");
    },
    restore() {
      this.calls.push("restore");
    },
    translate(x, y) {
      this.calls.push(`translate:${x},${y}`);
    },
    rotate(rotation) {
      this.calls.push(`rotate:${rotation}`);
    },
    scale(x, y) {
      this.calls.push(`scale:${x},${y}`);
    },
    fillRect(x, y, width, height) {
      this.calls.push(`fillRect:${x},${y},${width},${height}:${this.fillStyle}:${this.globalAlpha}:${this.filter}`);
    }
  };
}
