import type { GetResizeHandlesOptions, ResizeHandle, ResizeHandleName } from "./ResizeHandle.type.js";

const defaultHandleSize = 8;

const handleNames: readonly ResizeHandleName[] = ["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"];

const handleCursors: Record<ResizeHandleName, string> = {
  "top-left": "nwse-resize",
  top: "ns-resize",
  "top-right": "nesw-resize",
  right: "ew-resize",
  "bottom-right": "nwse-resize",
  bottom: "ns-resize",
  "bottom-left": "nesw-resize",
  left: "ew-resize"
};

export function getResizeHandles(options: GetResizeHandlesOptions): readonly ResizeHandle[] {
  const size = Math.max(0, options.size ?? defaultHandleSize);

  return handleNames.map((name) => {
    const center = getHandleCenter(name, options);
    return createHandle(name, center.x, center.y, size);
  });
}

function getHandleCenter(name: ResizeHandleName, options: GetResizeHandlesOptions): { readonly x: number; readonly y: number } {
  const { bounds } = options;
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;

  const centers: Record<ResizeHandleName, { readonly x: number; readonly y: number }> = {
    "top-left": { x: bounds.x, y: bounds.y },
    top: { x: centerX, y: bounds.y },
    "top-right": { x: bounds.right, y: bounds.y },
    right: { x: bounds.right, y: centerY },
    "bottom-right": { x: bounds.right, y: bounds.bottom },
    bottom: { x: centerX, y: bounds.bottom },
    "bottom-left": { x: bounds.x, y: bounds.bottom },
    left: { x: bounds.x, y: centerY }
  };

  return centers[name];
}

function createHandle(name: ResizeHandleName, centerX: number, centerY: number, size: number): ResizeHandle {
  return {
    name,
    x: centerX - size / 2,
    y: centerY - size / 2,
    width: size,
    height: size,
    cursor: handleCursors[name]
  };
}
