import { Rectangle } from "./Rectangle.js";
import type { BoundsPoint, GetWorldBoundsOptions } from "./Bounds.type.js";

export function getWorldBounds(options: GetWorldBoundsOptions): Rectangle {
  const { localBounds, object } = options;
  const originX = localBounds.x + localBounds.width * object.originX;
  const originY = localBounds.y + localBounds.height * object.originY;
  const corners = [
    transformPoint(localBounds.left - originX, localBounds.top - originY, options),
    transformPoint(localBounds.right - originX, localBounds.top - originY, options),
    transformPoint(localBounds.right - originX, localBounds.bottom - originY, options),
    transformPoint(localBounds.left - originX, localBounds.bottom - originY, options)
  ];
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return new Rectangle({
    x: minX,
    y: minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY
  });
}

function transformPoint(localX: number, localY: number, options: GetWorldBoundsOptions): BoundsPoint {
  return options.object.getWorldMatrix().transformPoint({ x: localX, y: localY });
}
