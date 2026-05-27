import type { StudioPoint } from "./StudioDrag.type";
import { resizeStudioBounds, resizeStudioBoxObject, resizeStudioCircleObject, resizeStudioSquareBounds } from "./StudioBoxResize";
import {
  createStudioLineResizeHandles,
  getStudioLineBounds,
  getStudioLineResizeState,
  resizeStudioLineEndpoint
} from "./StudioLineResize";
import { getStudioObjectBounds } from "./StudioObjectBounds";
import { getStudioTextResizeState, resizeStudioTextObject } from "./StudioTextResize";
import type {
  ResizeStudioObjectOptions,
  StudioResizeBounds,
  StudioResizeHandle,
  StudioResizeStart
} from "./StudioResize.type";
import type {
  StudioCircleState,
  StudioLineState,
  StudioRectState,
  StudioSceneObject,
  StudioSceneState,
  StudioSpriteState,
  StudioTextState
} from "./StudioSceneState.type";

const handleSize = 10;
const handleHitPadding = 5;

export function getStudioResizeHandles(
  scene: StudioSceneState,
  selectedObjectId: string | undefined
): readonly StudioResizeHandle[] {
  const line = getResizableLine(scene, selectedObjectId);

  if (line) {
    return createStudioLineResizeHandles(line);
  }

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
  const line = getResizableLine(scene, selectedObjectId);
  const text = getResizableText(scene, selectedObjectId);

  if (!handle) {
    return undefined;
  }

  return {
    selectedObjectId,
    session: {
      objectId: selectedObjectId,
      handleId: handle.id,
      startPointer: pointer,
      startBounds: bounds ?? getStudioLineBounds(line),
      ...(line ? { startLine: getStudioLineResizeState(line) } : {}),
      ...(text ? { startText: getStudioTextResizeState(text) } : {})
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

      if (object.type === "line" && options.session.startLine) {
        return resizeStudioLineEndpoint({
          object,
          handleId: options.session.handleId,
          startLine: options.session.startLine,
          pointer: options.pointer
        });
      }

      if (isBoxResizableObject(object)) {
        return resizeStudioBoxObject(object, resizeStudioBounds(options.session.startBounds, options.session.handleId, delta));
      }

      if (object.type === "circle") {
        return resizeStudioCircleObject(object, resizeStudioSquareBounds(options.session.startBounds, options.session.handleId, delta));
      }

      if (object.type === "text2d") {
        return resizeStudioTextObject({
          object,
          bounds: resizeStudioBounds(options.session.startBounds, options.session.handleId, delta)
        });
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

  return getStudioObjectBounds(object);
}

function getResizableLine(scene: StudioSceneState, objectId: string | undefined): StudioLineState | undefined {
  const object = scene.objects.find((candidate) => candidate.id === objectId);

  return object?.type === "line" ? object : undefined;
}

function getResizableText(scene: StudioSceneState, objectId: string | undefined): StudioTextState | undefined {
  const object = scene.objects.find((candidate) => candidate.id === objectId);

  return object?.type === "text2d" ? object : undefined;
}

function isResizableObject(object: StudioSceneObject): object is StudioCircleState | StudioLineState | StudioRectState | StudioSpriteState | StudioTextState {
  return object.type === "circle" || object.type === "line" || object.type === "text2d" || isBoxResizableObject(object);
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
