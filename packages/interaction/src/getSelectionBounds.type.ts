import type { CoreBoundsObject, Rectangle } from "raw2d-core";

export interface GetSelectionBoundsOptions {
  readonly objects: readonly CoreBoundsObject[];
}

export type SelectionBounds = Rectangle | null;
