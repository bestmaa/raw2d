import type { Camera2D } from "./Camera2D.js";
import type { CoreBoundsObject } from "./Bounds.type.js";
import type { SceneLike } from "./Scene.type.js";

export interface GetVisibleObjectsOptions {
  readonly scene: SceneLike;
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly includeInvisible?: boolean;
  readonly filter?: (object: CoreBoundsObject) => boolean;
}
