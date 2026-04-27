import { getWorldBounds } from "raw2d-core";
import type { Rectangle } from "raw2d-core";
import type { MeasureText2DBoundsOptions } from "./Text2DBounds.type.js";
import { measureText2DLocalBounds } from "./measureText2DLocalBounds.js";

export function measureText2DWorldBounds(options: MeasureText2DBoundsOptions): Rectangle {
  return getWorldBounds({
    object: options.text,
    localBounds: measureText2DLocalBounds(options)
  });
}
