import { Rect } from "raw2d";
import type { DrawShowcaseOverlayOptions } from "./ShowcaseOverlay.type";

const handleSize = 7;

export function drawShowcaseOverlay(options: DrawShowcaseOverlayOptions): void {
  const context = options.canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, options.canvas.width, options.canvas.height);
  context.save();
  context.strokeStyle = "#facc15";
  context.fillStyle = "#10141c";
  context.lineWidth = 2;

  for (const object of options.interaction.getSelection().getSelected()) {
    if (object instanceof Rect) {
      context.strokeRect(toScreenX(object.x, options), toScreenY(object.y, options), object.width * options.camera.zoom, object.height * options.camera.zoom);
    }
  }

  for (const handle of options.interaction.getResizeHandles()) {
    const x = toScreenX(handle.x, options);
    const y = toScreenY(handle.y, options);
    context.fillRect(x, y, handleSize, handleSize);
    context.strokeRect(x, y, handleSize, handleSize);
  }

  context.restore();
}

function toScreenX(value: number, options: DrawShowcaseOverlayOptions): number {
  return (value - options.camera.x) * options.camera.zoom;
}

function toScreenY(value: number, options: DrawShowcaseOverlayOptions): number {
  return (value - options.camera.y) * options.camera.zoom;
}
