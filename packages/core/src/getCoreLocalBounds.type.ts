import type { CoreBoundsObject } from "./Bounds.type.js";
import type { Rectangle } from "./Rectangle.js";

export type GetCoreLocalBounds = (object: CoreBoundsObject) => Rectangle;
