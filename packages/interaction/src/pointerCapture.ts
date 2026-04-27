import type { InteractionControllerPointerEvent } from "./InteractionController.type.js";

export function capturePointer(canvas: HTMLCanvasElement, event: InteractionControllerPointerEvent): void {
  event.preventDefault?.();

  if (event.pointerId !== undefined) {
    canvas.setPointerCapture(event.pointerId);
  }
}

export function releasePointer(canvas: HTMLCanvasElement, event: InteractionControllerPointerEvent): void {
  if (event.pointerId !== undefined && canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}
