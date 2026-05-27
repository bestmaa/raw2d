import type { ResizeStudioLineEndpointOptions, StudioLineResizeState } from "./StudioLineResize.type";
import type { StudioLineState } from "./StudioSceneState.type";
import type { StudioResizeBounds, StudioResizeHandle } from "./StudioResize.type";

const handleSize = 10;

export function createStudioLineResizeHandles(line: StudioLineState): readonly StudioResizeHandle[] {
  return [
    { id: "line-start", x: line.x + line.startX, y: line.y + line.startY, size: handleSize },
    { id: "line-end", x: line.x + line.endX, y: line.y + line.endY, size: handleSize }
  ];
}

export function resizeStudioLineEndpoint(options: ResizeStudioLineEndpointOptions): StudioLineState {
  const point = {
    x: Math.round(options.pointer.x - options.startLine.objectX),
    y: Math.round(options.pointer.y - options.startLine.objectY)
  };

  return options.handleId === "line-start"
    ? { ...options.object, startX: point.x, startY: point.y }
    : { ...options.object, endX: point.x, endY: point.y };
}

export function getStudioLineResizeState(line: StudioLineState): StudioLineResizeState {
  return {
    objectX: line.x,
    objectY: line.y,
    startX: line.startX,
    startY: line.startY,
    endX: line.endX,
    endY: line.endY
  };
}

export function getStudioLineBounds(line: StudioLineState | undefined): StudioResizeBounds {
  if (!line) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const start = { x: line.x + line.startX, y: line.y + line.startY };
  const end = { x: line.x + line.endX, y: line.y + line.endY };

  return { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y) };
}
