import type { CanvasOptions, CanvasRenderOptions } from "raw2d-canvas";
import type {
  ArcOptions,
  BasicMaterialOptions,
  CircleOptions,
  EllipseOptions,
  LineOptions,
  Object2DOptions,
  PolygonOptions,
  PolylineOptions,
  RectOptions,
  ShapePathOptions
} from "raw2d-core";
import type {
  Raw2DBlurEffect,
  Raw2DEffectBase,
  Raw2DEffectValidationIssue,
  Raw2DEffectValidationResult,
  Raw2DGrayscaleEffect,
  Raw2DOpacityEffect,
  Raw2DShadowEffect
} from "raw2d-effects";
import type {
  CameraControlsOptions,
  InteractionAttachOptions,
  InteractionControllerOptions,
  KeyboardControllerOptions,
  SelectionManagerOptions,
  SelectObjectOptions
} from "raw2d-interaction";
import type { SpriteOptions, TextureAtlasOptions, TextureOptions } from "raw2d-sprite";
import type { Text2DOptions } from "raw2d-text";
import type { WebGLRenderer2DOptions, WebGLRenderer2DRenderOptions } from "raw2d-webgl";

type Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends <
  Value
>() => Value extends Right ? 1 : 2
  ? true
  : false;

type Assert<Condition extends true> = Condition;

type Object2DOptionKeys =
  | "name"
  | "x"
  | "y"
  | "origin"
  | "rotation"
  | "scaleX"
  | "scaleY"
  | "zIndex"
  | "visible"
  | "renderMode";

type MaterialOptionKeys =
  | "fillColor"
  | "strokeColor"
  | "lineWidth"
  | "strokeCap"
  | "strokeJoin"
  | "miterLimit";

type InteractionControllerOptionKeys =
  | "canvas"
  | "scene"
  | "camera"
  | "selection"
  | "width"
  | "height"
  | "handleSize"
  | "minResizeWidth"
  | "minResizeHeight"
  | "pickTolerance"
  | "updateCursor"
  | "filter"
  | "onChange";

export type Object2DOptionsAreStable = Assert<Equal<keyof Object2DOptions, Object2DOptionKeys>>;
export type RectOptionsAreStable = Assert<Equal<keyof RectOptions, Object2DOptionKeys | "width" | "height" | "material">>;
export type CircleOptionsAreStable = Assert<Equal<keyof CircleOptions, Object2DOptionKeys | "radius" | "material">>;
export type LineOptionsAreStable = Assert<
  Equal<keyof LineOptions, Object2DOptionKeys | "startX" | "startY" | "endX" | "endY" | "material">
>;
export type EllipseOptionsAreStable = Assert<Equal<keyof EllipseOptions, Object2DOptionKeys | "radiusX" | "radiusY" | "material">>;
export type ArcOptionsAreStable = Assert<
  Equal<keyof ArcOptions, Object2DOptionKeys | "radiusX" | "radiusY" | "startAngle" | "endAngle" | "anticlockwise" | "closed" | "material">
>;
export type PolylineOptionsAreStable = Assert<Equal<keyof PolylineOptions, Object2DOptionKeys | "points" | "material">>;
export type PolygonOptionsAreStable = Assert<Equal<keyof PolygonOptions, Object2DOptionKeys | "points" | "material">>;
export type ShapePathOptionsAreStable = Assert<Equal<keyof ShapePathOptions, Object2DOptionKeys | "commands" | "material" | "fill" | "stroke">>;
export type Text2DOptionsAreStable = Assert<Equal<keyof Text2DOptions, Object2DOptionKeys | "text" | "font" | "align" | "baseline" | "material">>;
export type SpriteOptionsAreStable = Assert<Equal<keyof SpriteOptions, Object2DOptionKeys | "texture" | "frame" | "width" | "height" | "opacity">>;
export type BasicMaterialOptionsAreStable = Assert<Equal<keyof BasicMaterialOptions, MaterialOptionKeys>>;
export type TextureOptionsAreStable = Assert<Equal<keyof TextureOptions, "source" | "width" | "height" | "id" | "url">>;
export type TextureAtlasOptionsAreStable = Assert<Equal<keyof TextureAtlasOptions, "texture" | "frames">>;
export type InteractionControllerOptionsAreStable = Assert<Equal<keyof InteractionControllerOptions, InteractionControllerOptionKeys>>;
export type InteractionAttachOptionsAreStable = Assert<Equal<keyof InteractionAttachOptions, "select" | "drag" | "resize">>;
export type SelectionManagerOptionsAreStable = Assert<Equal<keyof SelectionManagerOptions, "objects">>;
export type SelectObjectOptionsAreStable = Assert<Equal<keyof SelectObjectOptions, "append" | "toggle">>;
export type CanvasOptionsAreStable = Assert<Equal<keyof CanvasOptions, "canvas" | "width" | "height" | "pixelRatio" | "alpha" | "backgroundColor">>;
export type CanvasRenderOptionsAreStable = Assert<Equal<keyof CanvasRenderOptions, "culling" | "renderList" | "cullingFilter" | "effects">>;
export type WebGLRenderer2DOptionsAreStable = Assert<
  Equal<
    keyof WebGLRenderer2DOptions,
    | "canvas"
    | "width"
    | "height"
    | "backgroundColor"
    | "createTextCanvas"
    | "createShapePathCanvas"
    | "textTextureCacheMaxEntries"
    | "shapePathTextureCacheMaxEntries"
    | "shapePathFillFallback"
    | "onShapePathFillFallback"
    | "curveSegments"
  >
>;
export type WebGLRenderer2DRenderOptionsAreStable = Assert<Equal<keyof WebGLRenderer2DRenderOptions, "culling" | "renderList" | "spriteSorting" | "curveSegments">>;
export type Raw2DEffectBaseKeysAreStable = Assert<Equal<keyof Raw2DEffectBase, "type" | "id" | "enabled">>;
export type Raw2DOpacityEffectKeysAreStable = Assert<Equal<keyof Raw2DOpacityEffect, keyof Raw2DEffectBase | "opacity">>;
export type Raw2DBlurEffectKeysAreStable = Assert<Equal<keyof Raw2DBlurEffect, keyof Raw2DEffectBase | "radius">>;
export type Raw2DGrayscaleEffectKeysAreStable = Assert<Equal<keyof Raw2DGrayscaleEffect, keyof Raw2DEffectBase | "amount">>;
export type Raw2DShadowEffectKeysAreStable = Assert<Equal<keyof Raw2DShadowEffect, keyof Raw2DEffectBase | "color" | "blur" | "offsetX" | "offsetY">>;
export type Raw2DEffectValidationIssueKeysAreStable = Assert<Equal<keyof Raw2DEffectValidationIssue, "path" | "message">>;
export type Raw2DEffectValidationResultKeysAreStable = Assert<Equal<keyof Raw2DEffectValidationResult, "valid" | "issues">>;
export type CameraControlsOptionsAreStable = Assert<
  Equal<keyof CameraControlsOptions, "target" | "camera" | "width" | "height" | "minZoom" | "maxZoom" | "zoomSpeed" | "panButton" | "preventDefault" | "onChange">
>;
export type KeyboardControllerOptionsAreStable = Assert<
  Equal<keyof KeyboardControllerOptions, "target" | "selection" | "scene" | "moveStep" | "fastMoveStep" | "preventDefault" | "onChange">
>;
