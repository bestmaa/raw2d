import type { EndObjectResizeOptions } from "./ObjectResize.type.js";

export function endObjectResize(options: EndObjectResizeOptions): void {
  options.state.active = false;
}
