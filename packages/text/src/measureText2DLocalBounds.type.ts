import type { Rectangle } from "raw2d-core";
import type { MeasureText2DBoundsOptions } from "./Text2DBounds.type.js";

export type MeasureText2DLocalBounds = (options: MeasureText2DBoundsOptions) => Rectangle;
