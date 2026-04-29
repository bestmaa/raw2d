import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect, ShapePath } from "raw2d-core";
import type { WebGLMaterialKeyParts } from "./WebGLMaterialKey.type.js";
import type { WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export function getWebGLMaterialKey(item: WebGLShapeItem): string {
  const object = item.object;

  if (object instanceof ShapePath) {
    return object.stroke ? getWebGLShapePathStrokeMaterialKey(object) : getWebGLShapePathFillMaterialKey(object);
  }

  if ((object instanceof Arc && !object.closed) || object instanceof Line || object instanceof Polyline) {
    return serializeMaterialKey({
      pass: "stroke",
      color: object.material.strokeColor,
      lineWidth: object.material.lineWidth,
      strokeCap: object.material.strokeCap,
      strokeJoin: object.material.strokeJoin,
      miterLimit: object.material.miterLimit
    });
  }

  if (object instanceof Arc || object instanceof Rect || object instanceof Circle || object instanceof Ellipse || object instanceof Polygon) {
    return serializeMaterialKey({
      pass: "fill",
      color: object.material.fillColor
    });
  }

  return "unsupported";
}

export function getWebGLShapePathFillMaterialKey(shapePath: ShapePath): string {
  return serializeMaterialKey({
    pass: "fill",
    color: shapePath.material.fillColor
  });
}

export function getWebGLShapePathStrokeMaterialKey(shapePath: ShapePath): string {
  return serializeMaterialKey({
    pass: "stroke",
    color: shapePath.material.strokeColor,
    lineWidth: shapePath.material.lineWidth,
    strokeCap: shapePath.material.strokeCap,
    strokeJoin: shapePath.material.strokeJoin,
    miterLimit: shapePath.material.miterLimit
  });
}

function serializeMaterialKey(parts: WebGLMaterialKeyParts): string {
  if (parts.lineWidth === undefined) {
    return `${parts.pass}:${parts.color}`;
  }

  return `${parts.pass}:${parts.color}:${parts.lineWidth}:${parts.strokeCap ?? "butt"}:${parts.strokeJoin ?? "miter"}:${parts.miterLimit ?? 10}`;
}
