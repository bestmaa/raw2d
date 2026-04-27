import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawEllipseOptions } from "./drawEllipse.type.js";

export function drawEllipse(options: DrawEllipseOptions): void {
  const { context, ellipse } = options;

  context.save();
  applyObjectTransform({ context, object: ellipse });
  applyOriginOffset({
    context,
    object: ellipse,
    localX: -ellipse.radiusX,
    localY: -ellipse.radiusY,
    width: ellipse.radiusX * 2,
    height: ellipse.radiusY * 2
  });
  context.beginPath();
  context.ellipse(0, 0, ellipse.radiusX, ellipse.radiusY, 0, 0, Math.PI * 2);
  context.fillStyle = ellipse.material.fillColor;
  context.fill();
  context.restore();
}
