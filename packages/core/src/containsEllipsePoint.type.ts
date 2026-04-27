import type { Ellipse } from "./Ellipse.js";
import type { HitTestPoint } from "./HitTest.type.js";

export interface ContainsEllipsePointOptions {
  readonly ellipse: Ellipse;
  readonly point: HitTestPoint;
}
