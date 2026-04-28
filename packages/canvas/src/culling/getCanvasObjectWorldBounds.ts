import {
  Arc,
  Circle,
  Ellipse,
  Line,
  Polygon,
  Polyline,
  Rect,
  ShapePath,
  getCoreLocalBounds,
  getWorldBounds,
  type CoreBoundsObject,
  type Rectangle
} from "raw2d-core";
import { Sprite, getSpriteWorldBounds } from "raw2d-sprite";
import { Text2D, measureText2DWorldBounds } from "raw2d-text";
import type { CanvasObject } from "../Canvas.type.js";
import type { GetCanvasObjectWorldBoundsOptions } from "./getCanvasObjectWorldBounds.type.js";

export function getCanvasObjectWorldBounds(options: GetCanvasObjectWorldBoundsOptions): Rectangle | null {
  const { object } = options;

  if (isCoreBoundsObject(object)) {
    return getWorldBounds({ object, localBounds: getCoreLocalBounds(object) });
  }

  if (object instanceof Sprite) {
    return getSpriteWorldBounds(object);
  }

  if (object instanceof Text2D) {
    return measureText2DWorldBounds({ context: options.context, text: object });
  }

  return null;
}

function isCoreBoundsObject(object: CanvasObject): object is CoreBoundsObject {
  return (
    object instanceof Rect ||
    object instanceof Circle ||
    object instanceof Ellipse ||
    object instanceof Arc ||
    object instanceof Line ||
    object instanceof Polyline ||
    object instanceof Polygon ||
    object instanceof ShapePath
  );
}
