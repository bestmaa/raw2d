import assert from "node:assert/strict";
import test from "node:test";
import * as Effects from "raw2d-effects";
import * as Interaction from "raw2d-interaction";
import * as ReactBridge from "raw2d-react";
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
    "getSpriteLocalBounds",
    "getSpriteWorldBounds",
    "getTextureSourceSize",
    "normalizeTextureSize"
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

test("raw2d-effects is intentionally empty for now", () => {
  assert.deepEqual(Object.keys(Effects), []);
});

test("raw2d-react exposes the first component bridge surface", () => {
  assert.deepEqual(Object.keys(ReactBridge).sort(), [
    "RAW2D_REACT_PACKAGE_INFO",
    "Raw2DCanvas",
    "createRaw2DReactRenderer"
  ].sort());
  assert.equal(typeof ReactBridge.Raw2DCanvas, "function");
  assert.equal(typeof ReactBridge.createRaw2DReactRenderer, "function");
  assert.equal(ReactBridge.RAW2D_REACT_PACKAGE_INFO.packageName, "raw2d-react");
  assert.equal(ReactBridge.RAW2D_REACT_PACKAGE_INFO.changesCoreApi, false);
});
