import type { StudioPoint } from "./StudioDrag.type";
import type { StudioCircleState, StudioRectState, StudioSpriteState } from "./StudioSceneState.type";
import type { StudioResizeBounds, StudioResizeHandleId } from "./StudioResize.type";

const minimumSize = 16;

export function resizeStudioBounds(bounds: StudioResizeBounds, handleId: StudioResizeHandleId, delta: StudioPoint): StudioResizeBounds {
  const horizontal = handleId.endsWith("left")
    ? normalizeAxis(bounds.x + bounds.width, bounds.x + delta.x)
    : normalizeAxis(bounds.x, bounds.x + bounds.width + delta.x);
  const vertical = handleId.startsWith("top")
    ? normalizeAxis(bounds.y + bounds.height, bounds.y + delta.y)
    : normalizeAxis(bounds.y, bounds.y + bounds.height + delta.y);

  return { x: horizontal.position, y: vertical.position, width: horizontal.size, height: vertical.size };
}

export function resizeStudioSquareBounds(bounds: StudioResizeBounds, handleId: StudioResizeHandleId, delta: StudioPoint): StudioResizeBounds {
  const fixedCorner = getFixedCorner(bounds, handleId);
  const movingCorner = getMovingCorner(bounds, handleId, delta);
  const size = Math.max(minimumSize, Math.abs(movingCorner.x - fixedCorner.x), Math.abs(movingCorner.y - fixedCorner.y));

  return {
    x: movingCorner.x < fixedCorner.x ? fixedCorner.x - size : fixedCorner.x,
    y: movingCorner.y < fixedCorner.y ? fixedCorner.y - size : fixedCorner.y,
    width: size,
    height: size
  };
}

export function resizeStudioBoxObject(object: StudioRectState | StudioSpriteState, bounds: StudioResizeBounds): StudioRectState | StudioSpriteState {
  return { ...object, x: Math.round(bounds.x), y: Math.round(bounds.y), width: Math.round(bounds.width), height: Math.round(bounds.height) };
}

export function resizeStudioCircleObject(object: StudioCircleState, bounds: StudioResizeBounds): StudioCircleState {
  return { ...object, x: Math.round(bounds.x + bounds.width / 2), y: Math.round(bounds.y + bounds.height / 2), radius: Math.round(bounds.width / 2) };
}

function getFixedCorner(bounds: StudioResizeBounds, handleId: StudioResizeHandleId): StudioPoint {
  return {
    x: handleId.endsWith("left") ? bounds.x + bounds.width : bounds.x,
    y: handleId.startsWith("top") ? bounds.y + bounds.height : bounds.y
  };
}

function getMovingCorner(bounds: StudioResizeBounds, handleId: StudioResizeHandleId, delta: StudioPoint): StudioPoint {
  return {
    x: (handleId.endsWith("left") ? bounds.x : bounds.x + bounds.width) + delta.x,
    y: (handleId.startsWith("top") ? bounds.y : bounds.y + bounds.height) + delta.y
  };
}

function normalizeAxis(fixedPosition: number, movingPosition: number): { readonly position: number; readonly size: number } {
  const size = Math.max(minimumSize, Math.abs(movingPosition - fixedPosition));
  const position = movingPosition < fixedPosition ? fixedPosition - size : fixedPosition;

  return { position, size };
}
