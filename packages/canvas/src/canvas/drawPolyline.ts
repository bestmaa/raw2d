import { getPolylineLocalBounds } from "raw2d-core";
import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import { applyStrokeStyle } from "./applyStrokeStyle.js";
import type { DrawPolylineOptions } from "./drawPolyline.type.js";

export function drawPolyline(options: DrawPolylineOptions): void {
  const { context, polyline } = options;

  if (polyline.points.length === 0) {
    return;
  }

  const bounds = getPolylineLocalBounds(polyline);

  context.save();
  applyObjectTransform({ context, object: polyline });
  applyOriginOffset({
    context,
    object: polyline,
    localX: bounds.x,
    localY: bounds.y,
    width: bounds.width,
    height: bounds.height
  });
  context.beginPath();
  context.moveTo(polyline.points[0].x, polyline.points[0].y);

  for (let index = 1; index < polyline.points.length; index += 1) {
    const point = polyline.points[index];
    context.lineTo(point.x, point.y);
  }

  applyStrokeStyle({ context, material: polyline.material });
  context.stroke();
  context.restore();
}
