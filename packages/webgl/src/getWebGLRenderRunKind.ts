import { Circle, Ellipse, Line, Polygon, Polyline, Rect, type Object2D } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import type { WebGLRenderRunKind } from "./WebGLRenderRun.type.js";

export function getWebGLRenderRunKind(object: Object2D): WebGLRenderRunKind {
  if (isWebGLShape(object)) {
    return "shape";
  }

  if (object instanceof Sprite) {
    return "sprite";
  }

  return "unsupported";
}

export function isWebGLShape(object: Object2D): object is Rect | Circle | Ellipse | Line | Polyline | Polygon {
  return (
    object instanceof Rect ||
    object instanceof Circle ||
    object instanceof Ellipse ||
    object instanceof Line ||
    object instanceof Polyline ||
    object instanceof Polygon
  );
}
