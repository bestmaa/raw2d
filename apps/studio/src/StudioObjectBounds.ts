import { getStudioLineBounds } from "./StudioLineResize";
import type { StudioResizeBounds } from "./StudioResize.type";
import { getStudioTextResizeBounds } from "./StudioTextResize";
import type { StudioSceneObject } from "./StudioSceneState.type";

export function getStudioObjectBounds(object: StudioSceneObject): StudioResizeBounds {
  if (object.type === "circle") {
    return { x: object.x - object.radius, y: object.y - object.radius, width: object.radius * 2, height: object.radius * 2 };
  }

  if (object.type === "line") {
    return getStudioLineBounds(object);
  }

  if (object.type === "text2d") {
    return getStudioTextResizeBounds(object);
  }

  return { x: object.x, y: object.y, width: object.width, height: object.height };
}
