import type { Circle } from "./Circle.js";
import type { HitTestPoint } from "./HitTest.type.js";

export interface ContainsCirclePointOptions {
  readonly circle: Circle;
  readonly point: HitTestPoint;
}
