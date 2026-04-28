import type { Object2DOrigin, Object2DOriginValue } from "./Object2D.type.js";

export function resolveObject2DOrigin(origin: Object2DOriginValue): Object2DOrigin {
  if (typeof origin !== "string") {
    return { x: origin.x, y: origin.y };
  }

  const origins: Record<string, Object2DOrigin> = {
    "top-left": { x: 0, y: 0 },
    top: { x: 0.5, y: 0 },
    "top-right": { x: 1, y: 0 },
    left: { x: 0, y: 0.5 },
    center: { x: 0.5, y: 0.5 },
    right: { x: 1, y: 0.5 },
    "bottom-left": { x: 0, y: 1 },
    bottom: { x: 0.5, y: 1 },
    "bottom-right": { x: 1, y: 1 }
  };

  return origins[origin];
}
