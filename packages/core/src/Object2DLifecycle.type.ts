import type { Object2D } from "./Object2D.js";

export interface Object2DLifecycleParent {
  readonly id: string;
  readonly name?: string;
}

export interface Object2DLifecycleState {
  readonly parent: Object2DLifecycleParent | null;
  readonly disposed: boolean;
}

export interface AttachObject2DOptions {
  readonly object: Object2D;
  readonly parent: Object2DLifecycleParent;
}

export interface DetachObject2DOptions {
  readonly object: Object2D;
  readonly parent?: Object2DLifecycleParent;
}
