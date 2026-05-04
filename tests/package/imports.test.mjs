import assert from "node:assert/strict";
import test from "node:test";
import * as Raw2D from "raw2d";
import { Canvas } from "raw2d-canvas";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { InteractionController, SelectionManager } from "raw2d-interaction";
import { Sprite, Texture, TextureAtlasPacker } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import {
  WebGLRenderer2D,
  WebGLShapePathTextureCache,
  analyzeWebGLSpriteBatching,
  createWebGLShapePathFallbackBatch,
  estimateWebGLSpriteTextureBinds,
  isWebGL2Available,
  sortWebGLSpritesForBatching
} from "raw2d-webgl";

test("umbrella package exports common public API", () => {
  assert.equal(typeof Raw2D.Canvas, "function");
  assert.equal(typeof Raw2D.CanvasRenderer, "function");
  assert.equal(typeof Raw2D.WebGLRenderer2D, "function");
  assert.equal(typeof Raw2D.Scene, "function");
  assert.equal(typeof Raw2D.Rect, "function");
  assert.equal(typeof Raw2D.Sprite, "function");
  assert.equal(typeof Raw2D.Text2D, "function");
  assert.equal(typeof Raw2D.InteractionController, "function");
});

test("umbrella package runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(Raw2D).sort(), getExpectedUmbrellaRuntimeExports());
});

test("umbrella package keeps Canvas as a compatibility alias", () => {
  assert.equal(Raw2D.Canvas, Raw2D.CanvasRenderer);
});

test("umbrella package keeps renderer internals out of runtime API", () => {
  assert.equal(Raw2D.CanvasObjectRenderer, undefined);
  assert.equal(Raw2D.WebGLFloatBuffer, undefined);
  assert.equal(Raw2D.WebGLTextTextureCache, undefined);
  assert.equal(Raw2D.WebGLShapePathTextureCache, undefined);
  assert.equal(Raw2D.createWebGLShapeBatch, undefined);
  assert.equal(Raw2D.createWebGLShapePathFallbackBatch, undefined);
  assert.equal(Raw2D.sortWebGLSpritesForBatching, undefined);
  assert.equal(Raw2D.drawRect, undefined);
  assert.equal(Raw2D.uid, undefined);
});

test("focused packages expose installable entry points", () => {
  assert.equal(typeof Canvas, "function");
  assert.equal(typeof WebGLRenderer2D, "function");
  assert.equal(typeof InteractionController, "function");
  assert.equal(typeof TextureAtlasPacker, "function");
  assert.equal(typeof isWebGL2Available, "function");
  assert.equal(typeof sortWebGLSpritesForBatching, "function");
  assert.equal(typeof estimateWebGLSpriteTextureBinds, "function");
  assert.equal(typeof analyzeWebGLSpriteBatching, "function");
  assert.equal(typeof WebGLShapePathTextureCache, "function");
  assert.equal(typeof createWebGLShapePathFallbackBatch, "function");
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

function getExpectedUmbrellaRuntimeExports() {
  return [
    "Arc",
    "AssetGroup",
    "AssetGroupLoader",
    "BasicMaterial",
    "Camera2D",
    "CameraControls",
    "Canvas",
    "CanvasRenderer",
    "Circle",
    "Ellipse",
    "Group2D",
    "InteractionController",
    "KeyboardController",
    "Line",
    "Matrix3",
    "Object2D",
    "Polygon",
    "Polyline",
    "Rect",
    "Rectangle",
    "RenderList",
    "RenderPipeline",
    "Scene",
    "SelectionManager",
    "ShapePath",
    "Sprite",
    "SpriteAnimationClip",
    "SpriteAnimator",
    "Text2D",
    "Texture",
    "TextureAtlas",
    "TextureAtlasLoader",
    "TextureAtlasPacker",
    "TextureLoader",
    "WebGLRenderer2D",
    "attachObject2D",
    "containsCirclePoint",
    "containsEllipsePoint",
    "containsLinePoint",
    "containsPoint",
    "containsPolygonPoint",
    "containsPolylinePoint",
    "containsRectPoint",
    "createSpriteAnimationClip",
    "createSpriteFromAtlas",
    "createSpritesFromAtlas",
    "endObjectDrag",
    "endObjectResize",
    "flattenPathCommands",
    "flattenShapePath",
    "getArcLocalBounds",
    "getCameraWorldBounds",
    "getCircleLocalBounds",
    "getCoreLocalBounds",
    "getEllipseLocalBounds",
    "getInteractionPoint",
    "getLineLocalBounds",
    "getObject2DLifecycleState",
    "getPolygonLocalBounds",
    "getPolylineLocalBounds",
    "getRectLocalBounds",
    "getRendererSupport",
    "getRendererSupportMatrix",
    "getResizeHandles",
    "getSelectionBounds",
    "getShapePathLocalBounds",
    "getSpriteLocalBounds",
    "getSpriteWorldBounds",
    "getVisibleObjects",
    "getWorldBounds",
    "isWebGL2Available",
    "measureText2DLocalBounds",
    "measureText2DWorldBounds",
    "pickObject",
    "pickResizeHandle",
    "resolveObject2DOrigin",
    "detachObject2D",
    "disposeObject2D",
    "sortRenderObjects",
    "startObjectDrag",
    "startObjectResize",
    "updateObjectDrag",
    "updateObjectResize",
    "worldToLocalPoint"
  ].sort();
}
