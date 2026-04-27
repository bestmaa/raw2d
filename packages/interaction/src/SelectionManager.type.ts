import type { Object2D } from "raw2d-core";

export interface SelectionManagerOptions {
  readonly objects?: readonly Object2D[];
}

export interface SelectObjectOptions {
  readonly append?: boolean;
  readonly toggle?: boolean;
}

export interface SelectionSnapshot {
  readonly objects: readonly Object2D[];
  readonly primary: Object2D | null;
}
