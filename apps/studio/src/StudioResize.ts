import type { StudioPoint } from "./StudioDrag.type";
import type {
  ResizeStudioObjectOptions,
  StudioResizeBounds,
  StudioResizeHandle,
  StudioResizeHandleId,
  StudioResizeStart
} from "./StudioResize.type";
import type { StudioRectState, StudioSceneObject, StudioSceneState, StudioSpriteState } from "./StudioSceneState.type";

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
  const nextBounds = resizeBounds(options.session.startBounds, options.session.handleId, {
    x: options.pointer.x - options.session.startPointer.x,
    y: options.pointer.y - options.session.startPointer.y
  });

  return {
    ...options.scene,
    objects: options.scene.objects.map((object) => {
      if (object.id !== options.session.objectId || !isResizableObject(object)) {
        return object;
      }

      return {
        ...object,
        x: Math.round(nextBounds.x),
        y: Math.round(nextBounds.y),
        width: Math.round(nextBounds.width),
        height: Math.round(nextBounds.height)
      };
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

  return { x: object.x, y: object.y, width: object.width, height: object.height };
}

function isResizableObject(object: StudioSceneObject): object is StudioRectState | StudioSpriteState {
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
  const left = handleId.endsWith("left") ? bounds.x + delta.x : bounds.x;
  const top = handleId.startsWith("top") ? bounds.y + delta.y : bounds.y;
  const right = handleId.endsWith("right") ? bounds.x + bounds.width + delta.x : bounds.x + bounds.width;
  const bottom = handleId.startsWith("bottom") ? bounds.y + bounds.height + delta.y : bounds.y + bounds.height;

  return normalizeBounds(left, top, right, bottom);
}

function normalizeBounds(left: number, top: number, right: number, bottom: number): StudioResizeBounds {
  const width = Math.max(minimumSize, right - left);
  const height = Math.max(minimumSize, bottom - top);

  return {
    x: right - left < minimumSize ? right - width : left,
    y: bottom - top < minimumSize ? bottom - height : top,
    width,
    height
  };
}
