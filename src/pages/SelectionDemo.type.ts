import type { CoreBoundsObject, Object2D } from "raw2d";
import type { SelectionManager } from "raw2d";

export interface SelectionDemoState {
  readonly selection: SelectionManager;
  selectedName: string;
}

export interface SelectionDemoObjects {
  readonly card: Object2D;
  readonly badge: Object2D;
}

export type SelectionBoundsObject = CoreBoundsObject;
