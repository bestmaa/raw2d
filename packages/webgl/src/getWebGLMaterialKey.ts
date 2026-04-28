import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect } from "raw2d-core";
import type { WebGLMaterialKeyParts } from "./WebGLMaterialKey.type.js";
import type { WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export function getWebGLMaterialKey(item: WebGLShapeItem): string {
  const object = item.object;

  if ((object instanceof Arc && !object.closed) || object instanceof Line || object instanceof Polyline) {
    return serializeMaterialKey({
      pass: "stroke",
      color: object.material.strokeColor,
      lineWidth: object.material.lineWidth
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

function serializeMaterialKey(parts: WebGLMaterialKeyParts): string {
  return parts.lineWidth === undefined ? `${parts.pass}:${parts.color}` : `${parts.pass}:${parts.color}:${parts.lineWidth}`;
}
