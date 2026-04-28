import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect, getRendererSupportMatrix, type Object2D } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import type { WebGLRenderRunKind } from "./WebGLRenderRun.type.js";

const webGLSupportedKinds = new Set(getRendererSupportMatrix().filter((entry) => entry.webgl !== "unsupported").map((entry) => entry.kind));

export function getWebGLRenderRunKind(object: Object2D): WebGLRenderRunKind {
  if (isWebGLShape(object)) {
    return "shape";
  }

  if (object instanceof Sprite || object instanceof Text2D) {
    return "sprite";
  }

  return "unsupported";
}

export function isWebGLShape(object: Object2D): object is Arc | Rect | Circle | Ellipse | Line | Polyline | Polygon {
  return (
    (object instanceof Arc && webGLSupportedKinds.has("Arc")) ||
    (object instanceof Rect && webGLSupportedKinds.has("Rect")) ||
    (object instanceof Circle && webGLSupportedKinds.has("Circle")) ||
    (object instanceof Ellipse && webGLSupportedKinds.has("Ellipse")) ||
    (object instanceof Line && webGLSupportedKinds.has("Line")) ||
    (object instanceof Polyline && webGLSupportedKinds.has("Polyline")) ||
    (object instanceof Polygon && webGLSupportedKinds.has("Polygon"))
  );
}
