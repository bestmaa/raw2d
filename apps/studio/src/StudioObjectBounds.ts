import { getStudioLineBounds } from "./StudioLineResize";
import type { StudioResizeBounds } from "./StudioResize.type";
import { getStudioTextResizeBounds } from "./StudioTextResize";
import type { StudioSceneObject } from "./StudioSceneState.type";

export function getStudioObjectBounds(object: StudioSceneObject): StudioResizeBounds {
  if (object.type === "group") {
    return getStudioGroupBounds(object.children, object.x, object.y);
  }

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

function getStudioGroupBounds(
  children: readonly StudioSceneObject[],
  groupX: number,
  groupY: number
): StudioResizeBounds {
  if (children.length === 0) {
    return { x: groupX, y: groupY, width: 1, height: 1 };
  }

  const bounds = children.map(getStudioObjectBounds);
  const minX = Math.min(...bounds.map((bound) => groupX + bound.x));
  const minY = Math.min(...bounds.map((bound) => groupY + bound.y));
  const maxX = Math.max(...bounds.map((bound) => groupX + bound.x + bound.width));
  const maxY = Math.max(...bounds.map((bound) => groupY + bound.y + bound.height));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
