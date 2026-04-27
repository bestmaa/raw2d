import type { Circle } from "./Circle.js";
import type { Line } from "./Line.js";
import type { Object2D } from "./Object2D.js";
import type { Rect } from "./Rect.js";
import type { Rectangle } from "./Rectangle.js";

export type CoreBoundsObject = Rect | Circle | Line;

export interface BoundsPoint {
  readonly x: number;
  readonly y: number;
}

export interface GetWorldBoundsOptions {
  readonly object: Object2D;
  readonly localBounds: Rectangle;
}
