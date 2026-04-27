import type { GetInteractionPointOptions, InteractionPoint } from "./InteractionPoint.type.js";

export function getInteractionPoint(options: GetInteractionPointOptions): InteractionPoint {
  const bounds = options.canvas.getBoundingClientRect();
  const width = options.width ?? bounds.width;
  const height = options.height ?? bounds.height;
  const canvasX = ((options.event.clientX - bounds.left) / bounds.width) * width;
  const canvasY = ((options.event.clientY - bounds.top) / bounds.height) * height;
  const camera = options.camera;

  if (!camera) {
    return {
      canvasX,
      canvasY,
      x: canvasX,
      y: canvasY
    };
  }

  return {
    canvasX,
    canvasY,
    x: canvasX / camera.zoom + camera.x,
    y: canvasY / camera.zoom + camera.y
  };
}
