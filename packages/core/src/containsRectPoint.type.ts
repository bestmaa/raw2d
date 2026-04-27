import type { HitTestPoint } from "./HitTest.type.js";
import type { Rect } from "./Rect.js";

export interface ContainsRectPointOptions {
  readonly rect: Rect;
  readonly point: HitTestPoint;
}
