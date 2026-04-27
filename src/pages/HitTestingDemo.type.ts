import type { Circle, Line, Polygon, Rect } from "raw2d";

export type HitTestingShapeName = "rect" | "circle" | "line" | "polygon" | "none";

export interface HitTestingDemoState {
  x: number;
  y: number;
  hitName: HitTestingShapeName;
}

export interface HitTestingDemoObjects {
  readonly rect: Rect;
  readonly circle: Circle;
  readonly line: Line;
  readonly polygon: Polygon;
}
