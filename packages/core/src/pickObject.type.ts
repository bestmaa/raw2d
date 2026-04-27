import type { HitTestObject, HitTestPoint } from "./HitTest.type.js";
import type { SceneLike, SceneObject } from "./Scene.type.js";

export interface PickObjectOptions extends HitTestPoint {
  readonly scene: SceneLike;
  readonly tolerance?: number;
  readonly topmost?: boolean;
  readonly filter?: (object: SceneObject) => boolean;
}

export type PickObjectResult = HitTestObject | null;
