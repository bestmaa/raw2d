import type { ObjectDragState, StartObjectDragOptions } from "./ObjectDrag.type.js";

export function startObjectDrag(options: StartObjectDragOptions): ObjectDragState {
  return {
    object: options.object,
    startPointerX: options.pointerX,
    startPointerY: options.pointerY,
    startObjectX: options.object.x,
    startObjectY: options.object.y,
    active: true
  };
}
