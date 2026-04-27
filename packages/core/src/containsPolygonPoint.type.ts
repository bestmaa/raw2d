import type { HitTestPoint } from "./HitTest.type.js";
import type { Polygon } from "./Polygon.js";

export interface ContainsPolygonPointOptions {
  readonly polygon: Polygon;
  readonly point: HitTestPoint;
}
