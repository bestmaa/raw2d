import type { HitTestPoint } from "./HitTest.type.js";
import type { Line } from "./Line.js";

export interface ContainsLinePointOptions {
  readonly line: Line;
  readonly point: HitTestPoint;
  readonly tolerance?: number;
}
