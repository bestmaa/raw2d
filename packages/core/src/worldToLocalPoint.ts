import type { HitTestPoint, WorldToLocalPointOptions } from "./HitTest.type.js";

export function worldToLocalPoint(options: WorldToLocalPointOptions): HitTestPoint {
  const { localBounds, object } = options;
  const translatedX = options.x - object.x;
  const translatedY = options.y - object.y;
  const cos = Math.cos(-object.rotation);
  const sin = Math.sin(-object.rotation);
  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;
  const scaledX = object.scaleX === 0 ? 0 : rotatedX / object.scaleX;
  const scaledY = object.scaleY === 0 ? 0 : rotatedY / object.scaleY;
  const originX = localBounds.x + localBounds.width * object.originX;
  const originY = localBounds.y + localBounds.height * object.originY;

  return {
    x: scaledX + originX,
    y: scaledY + originY
  };
}
