import { Rectangle, getCoreLocalBounds, getWorldBounds } from "raw2d-core";
import type { CoreBoundsObject } from "raw2d-core";
import type { GetSelectionBoundsOptions, SelectionBounds } from "./getSelectionBounds.type.js";

export function getSelectionBounds(options: GetSelectionBoundsOptions): SelectionBounds {
  let bounds: Rectangle | null = null;

  for (const object of options.objects) {
    const objectBounds = getObjectWorldBounds(object);
    bounds = bounds ? mergeBounds(bounds, objectBounds) : objectBounds;
  }

  return bounds;
}

function getObjectWorldBounds(object: CoreBoundsObject): Rectangle {
  return getWorldBounds({
    object,
    localBounds: getCoreLocalBounds(object)
  });
}

function mergeBounds(first: Rectangle, second: Rectangle): Rectangle {
  const minX = Math.min(first.x, second.x);
  const minY = Math.min(first.y, second.y);
  const maxX = Math.max(first.x + first.width, second.x + second.width);
  const maxY = Math.max(first.y + first.height, second.y + second.height);

  return new Rectangle({
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  });
}
