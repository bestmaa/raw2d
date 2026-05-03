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
  CameraControlsOptions,
  InteractionAttachOptions,
  InteractionControllerOptions,
  KeyboardControllerOptions,
  SelectionManagerOptions,
  SelectObjectOptions
} from "raw2d-interaction";
import type { SpriteOptions, TextureAtlasOptions, TextureOptions } from "raw2d-sprite";
import type { Text2DOptions } from "raw2d-text";

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
export type CameraControlsOptionsAreStable = Assert<
  Equal<keyof CameraControlsOptions, "target" | "camera" | "width" | "height" | "minZoom" | "maxZoom" | "zoomSpeed" | "panButton" | "preventDefault" | "onChange">
>;
export type KeyboardControllerOptionsAreStable = Assert<
  Equal<keyof KeyboardControllerOptions, "target" | "selection" | "scene" | "moveStep" | "fastMoveStep" | "preventDefault" | "onChange">
>;
