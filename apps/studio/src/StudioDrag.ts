import type { MoveStudioObjectOptions, StudioDragStart, StudioPoint } from "./StudioDrag.type";
import type { StudioCameraState, StudioSceneObject, StudioSceneState, StudioTextState } from "./StudioSceneState.type";

const lineHitTolerance = 8;

export function getStudioCanvasWorldPoint(
  canvas: HTMLCanvasElement,
  event: PointerEvent,
  camera: StudioCameraState
): StudioPoint {
  const bounds = canvas.getBoundingClientRect();
  const canvasX = ((event.clientX - bounds.left) / bounds.width) * canvas.width;
  const canvasY = ((event.clientY - bounds.top) / bounds.height) * canvas.height;

  return {
    x: canvasX / camera.zoom + camera.x,
    y: canvasY / camera.zoom + camera.y
  };
}

export function startStudioDrag(
  scene: StudioSceneState,
  selectedObjectId: string | undefined,
  pointer: StudioPoint
): StudioDragStart | undefined {
  const pickedId = pickStudioObjectId(scene, pointer);
  const objectId = pickedId ?? selectedObjectId;
  const object = scene.objects.find((candidate) => candidate.id === objectId);

  if (!object || !containsStudioObjectPoint(object, pointer)) {
    return undefined;
  }

  return {
    selectedObjectId: object.id,
    session: {
      objectId: object.id,
      startPointer: pointer,
      startObject: { x: object.x, y: object.y }
    }
  };
}

export function moveStudioObject(options: MoveStudioObjectOptions): StudioSceneState {
  const deltaX = options.pointer.x - options.session.startPointer.x;
  const deltaY = options.pointer.y - options.session.startPointer.y;

  return {
    ...options.scene,
    objects: options.scene.objects.map((object) => {
      if (object.id !== options.session.objectId) {
        return object;
      }

      return {
        ...object,
        x: Math.round(options.session.startObject.x + deltaX),
        y: Math.round(options.session.startObject.y + deltaY)
      };
    })
  };
}

export function pickStudioObjectId(scene: StudioSceneState, pointer: StudioPoint): string | undefined {
  for (const object of [...scene.objects].reverse()) {
    if (containsStudioObjectPoint(object, pointer)) {
      return object.id;
    }
  }

  return undefined;
}

function containsStudioObjectPoint(object: StudioSceneObject, pointer: StudioPoint): boolean {
  if (object.type === "rect" || object.type === "sprite") {
    return isPointInRect(pointer, object.x, object.y, object.width, object.height);
  }

  if (object.type === "circle") {
    return distance(pointer.x, pointer.y, object.x, object.y) <= object.radius;
  }

  if (object.type === "line") {
    return getPointSegmentDistance(pointer, {
      x: object.x + object.startX,
      y: object.y + object.startY
    }, {
      x: object.x + object.endX,
      y: object.y + object.endY
    }) <= Math.max(lineHitTolerance, object.material?.lineWidth ?? 0);
  }

  return containsTextPoint(object, pointer);
}

function containsTextPoint(object: StudioTextState, pointer: StudioPoint): boolean {
  const fontSize = parseFontSize(object.font);
  const width = Math.max(fontSize, object.text.length * fontSize * 0.6);

  return isPointInRect(pointer, object.x, object.y - fontSize, width, fontSize * 1.25);
}

function isPointInRect(point: StudioPoint, x: number, y: number, width: number, height: number): boolean {
  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

function getPointSegmentDistance(point: StudioPoint, start: StudioPoint, end: StudioPoint): number {
  const lengthSquared = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;

  if (lengthSquared === 0) {
    return distance(point.x, point.y, start.x, start.y);
  }

  const t = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lengthSquared)
  );
  return distance(point.x, point.y, start.x + t * (end.x - start.x), start.y + t * (end.y - start.y));
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x1 - x2, y1 - y2);
}

function parseFontSize(font: string | undefined): number {
  const match = font?.match(/(\d+(?:\.\d+)?)px/);
  return match ? Number(match[1]) : 24;
}
