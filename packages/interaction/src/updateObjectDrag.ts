import type { UpdateObjectDragOptions } from "./ObjectDrag.type.js";

export function updateObjectDrag(options: UpdateObjectDragOptions): void {
  if (!options.state.active) {
    return;
  }

  const deltaX = options.pointerX - options.state.startPointerX;
  const deltaY = options.pointerY - options.state.startPointerY;
  options.state.object.setPosition(options.state.startObjectX + deltaX, options.state.startObjectY + deltaY);
}
