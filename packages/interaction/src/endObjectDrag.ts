import type { EndObjectDragOptions } from "./ObjectDrag.type.js";

export function endObjectDrag(options: EndObjectDragOptions): void {
  options.state.active = false;
}
