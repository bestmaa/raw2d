import type { HitTestPoint, WorldToLocalPointOptions } from "./HitTest.type.js";

export function worldToLocalPoint(options: WorldToLocalPointOptions): HitTestPoint {
  const { localBounds, object } = options;
  const originX = localBounds.x + localBounds.width * object.originX;
  const originY = localBounds.y + localBounds.height * object.originY;
  const inverseMatrix = object.getWorldMatrix().clone();

  if (!inverseMatrix.invert()) {
    return { x: originX, y: originY };
  }

  const localPoint = inverseMatrix.transformPoint({ x: options.x, y: options.y });

  return {
    x: localPoint.x + originX,
    y: localPoint.y + originY
  };
}
