import { getPolygonLocalBounds } from "raw2d-core";
import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawPolygonOptions } from "./drawPolygon.type.js";

export function drawPolygon(options: DrawPolygonOptions): void {
  const { context, polygon } = options;

  if (polygon.points.length === 0) {
    return;
  }

  const bounds = getPolygonLocalBounds(polygon);

  context.save();
  applyObjectTransform({ context, object: polygon });
  applyOriginOffset({
    context,
    object: polygon,
    localX: bounds.x,
    localY: bounds.y,
    width: bounds.width,
    height: bounds.height
  });
  context.beginPath();
  context.moveTo(polygon.points[0].x, polygon.points[0].y);

  for (let index = 1; index < polygon.points.length; index += 1) {
    const point = polygon.points[index];
    context.lineTo(point.x, point.y);
  }

  context.closePath();
  context.fillStyle = polygon.material.fillColor;
  context.fill();

  if (polygon.material.lineWidth > 0) {
    context.strokeStyle = polygon.material.strokeColor;
    context.lineWidth = polygon.material.lineWidth;
    context.stroke();
  }

  context.restore();
}
