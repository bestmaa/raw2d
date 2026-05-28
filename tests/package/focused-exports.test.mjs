import assert from "node:assert/strict";
import test from "node:test";
import * as Effects from "raw2d-effects";
import * as Interaction from "raw2d-interaction";
import * as ReactBridge from "raw2d-react";
import * as ReactFiber from "raw2d-react-fiber";
import * as Sprite from "raw2d-sprite";
import * as Text from "raw2d-text";

test("raw2d-sprite runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(Sprite).sort(), [
    "AssetGroup",
    "AssetGroupLoader",
    "Sprite",
    "SpriteAnimationClip",
    "SpriteAnimator",
    "Texture",
    "TextureAtlas",
    "TextureAtlasLoader",
    "TextureAtlasPacker",
    "TextureLoader",
    "createSpriteAnimationClip",
    "createSpriteFromAtlas",
    "createSpritesFromAtlas",
    "createSvgTexture",
    "getSpriteLocalBounds",
    "getSpriteWorldBounds",
    "getTextureSourceSize",
    "normalizeTextureSize",
    "rasterizeSvgToCanvas"
  ].sort());
});

test("raw2d-text runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(Text).sort(), [
    "Text2D",
    "measureText2DLocalBounds",
    "measureText2DWorldBounds"
  ].sort());
});

test("raw2d-interaction runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(Interaction).sort(), [
    "CameraControls",
    "InteractionController",
    "KeyboardController",
    "SelectionManager",
    "endObjectDrag",
    "endObjectResize",
    "getInteractionPoint",
    "getResizeHandles",
    "getSelectionBounds",
    "pickResizeHandle",
    "startObjectDrag",
    "startObjectResize",
    "updateObjectDrag",
    "updateObjectResize"
  ].sort());
});

test("raw2d-effects runtime exports match the audited public surface", () => {
  assert.deepEqual(Object.keys(Effects).sort(), [
    "createBlurEffect",
    "createGrayscaleEffect",
    "createOpacityEffect",
    "createShadowEffect",
    "isRaw2DEffect",
    "validateRaw2DEffect",
    "validateRaw2DEffects"
  ].sort());
});

test("raw2d-react exposes the first component bridge surface", () => {
  assert.deepEqual(Object.keys(ReactBridge).sort(), [
    "RAW2D_REACT_PACKAGE_INFO",
    "RawCircle",
    "Raw2DCanvas",
    "RawLine",
    "RawRect",
    "RawSprite",
    "RawText2D",
    "createRaw2DReactRenderer"
  ].sort());
  assert.equal(typeof ReactBridge.Raw2DCanvas, "function");
  assert.equal(typeof ReactBridge.RawRect, "function");
  assert.equal(typeof ReactBridge.RawCircle, "function");
  assert.equal(typeof ReactBridge.RawLine, "function");
  assert.equal(typeof ReactBridge.RawSprite, "function");
  assert.equal(typeof ReactBridge.RawText2D, "function");
  assert.equal(typeof ReactBridge.createRaw2DReactRenderer, "function");
  assert.equal(ReactBridge.RAW2D_REACT_PACKAGE_INFO.packageName, "raw2d-react");
  assert.equal(ReactBridge.RAW2D_REACT_PACKAGE_INFO.changesCoreApi, false);
});

test("raw2d-react-fiber exposes the scaffolded reconciler boundary", () => {
  assert.deepEqual(Object.keys(ReactFiber).sort(), [
    "RAW2D_FIBER_HOST_BOUNDARY",
    "RAW2D_REACT_FIBER_PACKAGE_INFO",
    "getRaw2DFiberHostBoundary"
  ].sort());
  assert.equal(ReactFiber.RAW2D_REACT_FIBER_PACKAGE_INFO.packageName, "raw2d-react-fiber");
  assert.equal(ReactFiber.RAW2D_REACT_FIBER_PACKAGE_INFO.changesCoreApi, false);
  assert.equal(ReactFiber.RAW2D_FIBER_HOST_BOUNDARY.ownsRenderer, false);
  assert.deepEqual(ReactFiber.getRaw2DFiberHostBoundary(), ReactFiber.RAW2D_FIBER_HOST_BOUNDARY);
});
