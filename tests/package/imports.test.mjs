import assert from "node:assert/strict";
import test from "node:test";
import * as Raw2D from "raw2d";
import { Canvas } from "raw2d-canvas";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { InteractionController, SelectionManager } from "raw2d-interaction";
import { Sprite, Texture, TextureAtlasPacker } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { WebGLRenderer2D, isWebGL2Available } from "raw2d-webgl";

test("umbrella package exports common public API", () => {
  assert.equal(typeof Raw2D.Canvas, "function");
  assert.equal(typeof Raw2D.WebGLRenderer2D, "function");
  assert.equal(typeof Raw2D.Scene, "function");
  assert.equal(typeof Raw2D.Rect, "function");
  assert.equal(typeof Raw2D.Sprite, "function");
  assert.equal(typeof Raw2D.Text2D, "function");
  assert.equal(typeof Raw2D.InteractionController, "function");
});

test("focused packages expose installable entry points", () => {
  assert.equal(typeof Canvas, "function");
  assert.equal(typeof WebGLRenderer2D, "function");
  assert.equal(typeof InteractionController, "function");
  assert.equal(typeof TextureAtlasPacker, "function");
  assert.equal(typeof isWebGL2Available, "function");
});

test("package imports can build a small scene without browser globals", () => {
  const texture = new Texture({ source: { width: 16, height: 16 }, width: 16, height: 16 });
  const scene = new Scene();
  const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
  const rect = new Rect({ width: 20, height: 10, material: new BasicMaterial({ fillColor: "#35c2ff" }) });
  const sprite = new Sprite({ texture, width: 16, height: 16 });
  const text = new Text2D({ text: "Raw2D" });
  const selection = new SelectionManager();

  scene.add(rect).add(sprite).add(text);
  selection.select(rect);

  assert.equal(scene.getObjects().length, 3);
  assert.equal(camera.zoom, 1);
  assert.equal(selection.getPrimary(), rect);
});
