import type { StudioPoint } from "./StudioDrag.type";
import type {
  ResizeStudioObjectOptions,
  StudioResizeBounds,
  StudioResizeHandle,
  StudioResizeHandleId,
  StudioResizeStart
} from "./StudioResize.type";
import type { StudioCircleState, StudioRectState, StudioSceneObject, StudioSceneState, StudioSpriteState } from "./StudioSceneState.type";

const handleSize = 10;
const handleHitPadding = 5;
const minimumSize = 16;

export function getStudioResizeHandles(
  scene: StudioSceneState,
  selectedObjectId: string | undefined
): readonly StudioResizeHandle[] {
  const bounds = getResizableObjectBounds(scene, selectedObjectId);

  if (!bounds) {
    return [];
  }

  return [
    { id: "top-left", x: bounds.x, y: bounds.y, size: handleSize },
    { id: "top-right", x: bounds.x + bounds.width, y: bounds.y, size: handleSize },
    { id: "bottom-left", x: bounds.x, y: bounds.y + bounds.height, size: handleSize },
    { id: "bottom-right", x: bounds.x + bounds.width, y: bounds.y + bounds.height, size: handleSize }
  ];
}

export function startStudioResize(
  scene: StudioSceneState,
  selectedObjectId: string | undefined,
  pointer: StudioPoint
): StudioResizeStart | undefined {
  const bounds = getResizableObjectBounds(scene, selectedObjectId);

  if (!selectedObjectId || !bounds) {
    return undefined;
  }

  const handle = getStudioResizeHandles(scene, selectedObjectId).find((candidate) => containsHandle(candidate, pointer));

  if (!handle) {
    return undefined;
  }

  return {
    selectedObjectId,
    session: {
      objectId: selectedObjectId,
      handleId: handle.id,
      startPointer: pointer,
      startBounds: bounds
    }
  };
}

export function resizeStudioObject(options: ResizeStudioObjectOptions): StudioSceneState {
  const delta = {
    x: options.pointer.x - options.session.startPointer.x,
    y: options.pointer.y - options.session.startPointer.y
  };

  return {
    ...options.scene,
    objects: options.scene.objects.map((object) => {
      if (object.id !== options.session.objectId) {
        return object;
      }

      if (isBoxResizableObject(object)) {
        return resizeBoxObject(object, resizeBounds(options.session.startBounds, options.session.handleId, delta));
      }

      if (object.type === "circle") {
        return resizeCircleObject(object, resizeSquareBounds(options.session.startBounds, options.session.handleId, delta));
      }

      return object;
    })
  };
}

export function drawStudioResizeHandles(
  context: CanvasRenderingContext2D,
  scene: StudioSceneState,
  selectedObjectId: string | undefined
): void {
  const handles = getStudioResizeHandles(scene, selectedObjectId);

  if (handles.length === 0) {
    return;
  }

  context.save();
  context.scale(scene.camera.zoom, scene.camera.zoom);
  context.translate(-scene.camera.x, -scene.camera.y);
  context.fillStyle = "#facc15";
  context.strokeStyle = "#0a121c";
  context.lineWidth = 2;

  for (const handle of handles) {
    context.fillRect(handle.x - handle.size / 2, handle.y - handle.size / 2, handle.size, handle.size);
    context.strokeRect(handle.x - handle.size / 2, handle.y - handle.size / 2, handle.size, handle.size);
  }

  context.restore();
}

function getResizableObjectBounds(scene: StudioSceneState, objectId: string | undefined): StudioResizeBounds | undefined {
  const object = scene.objects.find((candidate) => candidate.id === objectId);

  if (!object || !isResizableObject(object)) {
    return undefined;
  }

  if (object.type === "circle") {
    return { x: object.x - object.radius, y: object.y - object.radius, width: object.radius * 2, height: object.radius * 2 };
  }

  return { x: object.x, y: object.y, width: object.width, height: object.height };
}

function isResizableObject(object: StudioSceneObject): object is StudioCircleState | StudioRectState | StudioSpriteState {
  return object.type === "circle" || isBoxResizableObject(object);
}

function isBoxResizableObject(object: StudioSceneObject): object is StudioRectState | StudioSpriteState {
  return object.type === "rect" || object.type === "sprite";
}

function containsHandle(handle: StudioResizeHandle, pointer: StudioPoint): boolean {
  const radius = handle.size / 2 + handleHitPadding;

  return (
    pointer.x >= handle.x - radius &&
    pointer.x <= handle.x + radius &&
    pointer.y >= handle.y - radius &&
    pointer.y <= handle.y + radius
  );
}

function resizeBounds(bounds: StudioResizeBounds, handleId: StudioResizeHandleId, delta: StudioPoint): StudioResizeBounds {
  const horizontal = handleId.endsWith("left")
    ? normalizeAxis(bounds.x + bounds.width, bounds.x + delta.x)
    : normalizeAxis(bounds.x, bounds.x + bounds.width + delta.x);
  const vertical = handleId.startsWith("top")
    ? normalizeAxis(bounds.y + bounds.height, bounds.y + delta.y)
    : normalizeAxis(bounds.y, bounds.y + bounds.height + delta.y);

  return { x: horizontal.position, y: vertical.position, width: horizontal.size, height: vertical.size };
}

function resizeSquareBounds(bounds: StudioResizeBounds, handleId: StudioResizeHandleId, delta: StudioPoint): StudioResizeBounds {
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

function resizeBoxObject(object: StudioRectState | StudioSpriteState, bounds: StudioResizeBounds): StudioRectState | StudioSpriteState {
  return {
    ...object,
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height)
  };
}

function resizeCircleObject(object: StudioCircleState, bounds: StudioResizeBounds): StudioCircleState {
  return {
    ...object,
    x: Math.round(bounds.x + bounds.width / 2),
    y: Math.round(bounds.y + bounds.height / 2),
    radius: Math.round(bounds.width / 2)
  };
}

function normalizeAxis(fixedPosition: number, movingPosition: number): { readonly position: number; readonly size: number } {
  const size = Math.max(minimumSize, Math.abs(movingPosition - fixedPosition));
  const position = movingPosition < fixedPosition ? fixedPosition - size : fixedPosition;

  return { position, size };
}
