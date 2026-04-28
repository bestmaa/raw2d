import type { ApplyObjectTransformOptions } from "./applyObjectTransform.type.js";

export function applyObjectTransform(options: ApplyObjectTransformOptions): void {
  if (typeof options.context.transform !== "function") {
    options.context.translate(options.object.x, options.object.y);
    options.context.rotate(options.object.rotation);
    options.context.scale(options.object.scaleX, options.object.scaleY);
    return;
  }

  const matrix = options.object.getLocalMatrix().getElements();
  options.context.transform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]);
}
