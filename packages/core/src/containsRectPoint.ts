import { getRectLocalBounds } from "./getRectLocalBounds.js";
import type { ContainsRectPointOptions } from "./containsRectPoint.type.js";

export function containsRectPoint(options: ContainsRectPointOptions): boolean {
  return getRectLocalBounds(options.rect).containsPoint(options.point);
}
