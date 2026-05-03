import type { DependencyList } from "react";
import type { Object2D } from "raw2d";

export interface UseRaw2DSceneObjectOptions<TObject extends Object2D> {
  readonly object: TObject;
  readonly update: () => void;
  readonly dependencies: DependencyList;
}
