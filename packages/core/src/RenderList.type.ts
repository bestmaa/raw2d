import type { Object2D } from "./Object2D.js";
import type { RenderItem } from "./RenderItem.type.js";

export interface RenderListStats {
  readonly total: number;
  readonly accepted: number;
  readonly hidden: number;
  readonly filtered: number;
  readonly culled: number;
}

export interface RenderListOptions<TObject extends Object2D = Object2D> {
  readonly rootItems: readonly RenderItem<TObject>[];
  readonly flatItems: readonly RenderItem<TObject>[];
  readonly stats: RenderListStats;
}

