import type { PickResizeHandleOptions, PickResizeHandleResult, ResizeHandle } from "./ResizeHandle.type.js";

export function pickResizeHandle(options: PickResizeHandleOptions): PickResizeHandleResult {
  for (let index = options.handles.length - 1; index >= 0; index -= 1) {
    const handle = options.handles[index];

    if (handle && containsPoint(handle, options.x, options.y)) {
      return handle;
    }
  }

  return null;
}

function containsPoint(handle: ResizeHandle, x: number, y: number): boolean {
  return x >= handle.x && x <= handle.x + handle.width && y >= handle.y && y <= handle.y + handle.height;
}
