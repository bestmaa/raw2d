import type { HitTestPoint } from "./HitTest.type.js";
import type { Polyline } from "./Polyline.js";

export interface ContainsPolylinePointOptions {
  readonly polyline: Polyline;
  readonly point: HitTestPoint;
  readonly tolerance?: number;
}
