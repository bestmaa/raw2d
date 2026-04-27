import type { ApplyObjectTransformOptions } from "./applyObjectTransform.type";

export function applyObjectTransform(options: ApplyObjectTransformOptions): void {
  options.context.translate(options.object.x, options.object.y);
  options.context.rotate(options.object.rotation);
  options.context.scale(options.object.scaleX, options.object.scaleY);
}
