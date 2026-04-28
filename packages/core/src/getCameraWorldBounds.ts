import { Rectangle } from "./Rectangle.js";
import type { GetCameraWorldBoundsOptions } from "./getCameraWorldBounds.type.js";

export function getCameraWorldBounds(options: GetCameraWorldBoundsOptions): Rectangle {
  const width = Math.max(0, options.width) / options.camera.zoom;
  const height = Math.max(0, options.height) / options.camera.zoom;

  return new Rectangle({
    x: options.camera.x,
    y: options.camera.y,
    width,
    height
  });
}
