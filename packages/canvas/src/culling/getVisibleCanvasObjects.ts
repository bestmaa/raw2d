import { getCameraWorldBounds } from "raw2d-core";
import type { CanvasObject } from "../Canvas.type.js";
import { getCanvasObjectWorldBounds } from "./getCanvasObjectWorldBounds.js";
import type { GetVisibleCanvasObjectsOptions } from "./getVisibleCanvasObjects.type.js";

export function getVisibleCanvasObjects(options: GetVisibleCanvasObjectsOptions): readonly CanvasObject[] {
  const cameraBounds = getCameraWorldBounds(options);
  const visibleObjects: CanvasObject[] = [];

  for (const object of options.objects) {
    if (!canUseObject(object, options)) {
      continue;
    }

    const objectBounds = getCanvasObjectWorldBounds({ object, context: options.context });

    if (!objectBounds || objectBounds.intersects(cameraBounds)) {
      visibleObjects.push(object);
    }
  }

  return visibleObjects;
}

function canUseObject(object: CanvasObject, options: GetVisibleCanvasObjectsOptions): boolean {
  if (!object.visible) {
    return false;
  }

  return options.renderOptions?.cullingFilter?.(object) ?? true;
}
