import type { ObjectResizeState, StartObjectResizeOptions } from "./ObjectResize.type.js";

const defaultMinimumSize = 1;

export function startObjectResize(options: StartObjectResizeOptions): ObjectResizeState {
  return {
    object: options.object,
    handleName: options.handleName,
    startPointerX: options.pointerX,
    startPointerY: options.pointerY,
    startObjectX: options.object.x,
    startObjectY: options.object.y,
    startWidth: options.object.width,
    startHeight: options.object.height,
    minWidth: Math.max(0, options.minWidth ?? defaultMinimumSize),
    minHeight: Math.max(0, options.minHeight ?? defaultMinimumSize),
    active: true
  };
}
