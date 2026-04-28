import type { Object2D } from "./Object2D.js";
import type { Object2DOptions } from "./Object2D.type.js";

export type Group2DChild = Object2D;

export interface Group2DOptions extends Object2DOptions {
  readonly children?: readonly Group2DChild[];
}

export interface Group2DLike {
  add(child: Group2DChild): this;
  remove(child: Group2DChild): this;
  clear(): void;
  getChildren(): readonly Group2DChild[];
}
