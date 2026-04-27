import type { ApplyOriginOffsetOptions } from "./applyOriginOffset.type.js";

export function applyOriginOffset(options: ApplyOriginOffsetOptions): void {
  const offsetX = options.localX + options.width * options.object.originX;
  const offsetY = options.localY + options.height * options.object.originY;
  options.context.translate(-offsetX, -offsetY);
}
