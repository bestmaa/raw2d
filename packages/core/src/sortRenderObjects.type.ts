import type { Object2D } from "./Object2D.js";

export interface SortRenderObjectsOptions<TObject extends Object2D = Object2D> {
  readonly objects: readonly TObject[];
}

export type SortRenderObjects = <TObject extends Object2D>(
  options: SortRenderObjectsOptions<TObject>
) => readonly TObject[];
