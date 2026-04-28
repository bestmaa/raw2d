import { Arc } from "./Arc.js";
import { Circle } from "./Circle.js";
import { Ellipse } from "./Ellipse.js";
import { Line } from "./Line.js";
import { Polygon } from "./Polygon.js";
import { Polyline } from "./Polyline.js";
import { Rect } from "./Rect.js";
import { ShapePath } from "./ShapePath.js";
import { getCameraWorldBounds } from "./getCameraWorldBounds.js";
import { getCoreLocalBounds } from "./getCoreLocalBounds.js";
import { getWorldBounds } from "./getWorldBounds.js";
import type { CoreBoundsObject } from "./Bounds.type.js";
import type { Object2D } from "./Object2D.js";
import type { GetVisibleObjectsOptions } from "./getVisibleObjects.type.js";

export function getVisibleObjects(options: GetVisibleObjectsOptions): readonly CoreBoundsObject[] {
  const cameraBounds = getCameraWorldBounds(options);
  const visibleObjects: CoreBoundsObject[] = [];

  for (const object of options.scene.getObjects()) {
    if (!canUseObject(object, options)) {
      continue;
    }

    const objectBounds = getWorldBounds({ object, localBounds: getCoreLocalBounds(object) });

    if (objectBounds.intersects(cameraBounds)) {
      visibleObjects.push(object);
    }
  }

  return visibleObjects;
}

function canUseObject(object: Object2D, options: GetVisibleObjectsOptions): object is CoreBoundsObject {
  if (!isCoreBoundsObject(object)) {
    return false;
  }

  if (!options.includeInvisible && !object.visible) {
    return false;
  }

  return options.filter?.(object) ?? true;
}

function isCoreBoundsObject(object: Object2D): object is CoreBoundsObject {
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
