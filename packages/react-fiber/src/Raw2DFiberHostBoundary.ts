import type { Raw2DFiberHostBoundary } from "./Raw2DFiberHostBoundary.type.js";

export const RAW2D_FIBER_HOST_BOUNDARY: Raw2DFiberHostBoundary = {
  packageName: "raw2d-react-fiber",
  changesCoreApi: false,
  ownsRenderer: false,
  supportedObjects: ["Rect", "Circle", "Line", "Text2D", "Sprite", "Group2D"],
  stages: ["instance", "props", "tree", "commit", "renderer"],
  notes: [
    "React Fiber may create and update Raw2D objects, but renderers keep drawing ownership.",
    "Core scene objects stay renderer-agnostic and must not import React.",
    "Texture and asset cleanup stays explicit so lifecycle behavior remains debuggable."
  ]
};

export function getRaw2DFiberHostBoundary(): Raw2DFiberHostBoundary {
  return RAW2D_FIBER_HOST_BOUNDARY;
}
