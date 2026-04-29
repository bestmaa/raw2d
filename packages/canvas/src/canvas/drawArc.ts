import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import { applyStrokeStyle } from "./applyStrokeStyle.js";
import type { DrawArcOptions } from "./drawArc.type.js";

export function drawArc(options: DrawArcOptions): void {
  const { context, arc } = options;

  context.save();
  applyObjectTransform({ context, object: arc });
  applyOriginOffset({
    context,
    object: arc,
    localX: -arc.radiusX,
    localY: -arc.radiusY,
    width: arc.radiusX * 2,
    height: arc.radiusY * 2
  });
  context.beginPath();
  context.ellipse(0, 0, arc.radiusX, arc.radiusY, 0, arc.startAngle, arc.endAngle, arc.anticlockwise);

  if (arc.closed) {
    context.lineTo(0, 0);
    context.closePath();
    context.fillStyle = arc.material.fillColor;
    context.fill();
  } else {
    applyStrokeStyle({ context, material: arc.material });
    context.stroke();
  }

  context.restore();
}
