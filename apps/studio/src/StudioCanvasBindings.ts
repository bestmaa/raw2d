import { createStudioTransformCommand, findStudioObject } from "./StudioCommandFactory";
import { getStudioCanvasWorldPoint, moveStudioObject, startStudioDrag } from "./StudioDrag";
import type { StudioDragSession } from "./StudioDrag.type";
import { resizeStudioObject, startStudioResize } from "./StudioResize";
import type { StudioResizeSession } from "./StudioResize.type";
import type { StudioCanvasBindingOptions } from "./StudioCanvasBindings.type";

export function bindStudioCanvasDrag(options: StudioCanvasBindingOptions): void {
  const canvasElement = options.root.querySelector<HTMLCanvasElement>(".studio-canvas");
  let dragSession: StudioDragSession | undefined;
  let resizeSession: StudioResizeSession | undefined;

  if (!canvasElement) {
    return;
  }

  canvasElement.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const pointer = getStudioCanvasWorldPoint(canvasElement, event, options.getScene().camera);
    canvasElement.focus();
    const resizeStart = startStudioResize(options.getScene(), options.getSelectedObjectId(), pointer);

    if (resizeStart) {
      options.setSelectedObjectId(resizeStart.selectedObjectId);
      resizeSession = resizeStart.session;
      canvasElement.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    const dragStart = startStudioDrag(options.getScene(), options.getSelectedObjectId(), pointer);

    if (!dragStart) {
      return;
    }

    options.setSelectedObjectId(dragStart.selectedObjectId);
    dragSession = dragStart.session;
    canvasElement.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  canvasElement.addEventListener("pointermove", (event) => {
    const pointer = getStudioCanvasWorldPoint(canvasElement, event, options.getScene().camera);

    if (resizeSession) {
      options.setScene(resizeStudioObject({ scene: options.getScene(), session: resizeSession, pointer }));
      options.renderRuntimeScene();
      event.preventDefault();
      return;
    }

    if (!dragSession) {
      return;
    }

    options.setScene(moveStudioObject({ scene: options.getScene(), session: dragSession, pointer }));
    options.renderRuntimeScene();
    event.preventDefault();
  });

  const finishDrag = (event: PointerEvent): void => {
    const session = dragSession ?? resizeSession;

    if (!session) {
      return;
    }

    const didRecordCommand = recordCanvasTransform(options, session);
    dragSession = undefined;
    resizeSession = undefined;
    if (canvasElement.hasPointerCapture(event.pointerId)) {
      canvasElement.releasePointerCapture(event.pointerId);
    }
    event.preventDefault();
    if (!didRecordCommand) {
      options.mount();
    }
  };

  canvasElement.addEventListener("pointerup", finishDrag);
  canvasElement.addEventListener("pointercancel", finishDrag);
}

function recordCanvasTransform(options: StudioCanvasBindingOptions, session: StudioDragSession | StudioResizeSession): boolean {
  const object = findStudioObject(options.getScene(), session.objectId);

  if (!object) {
    return false;
  }

  const before = "startObject" in session
    ? { ...object, x: session.startObject.x, y: session.startObject.y }
    : session.startLine
      ? {
          ...object,
          x: session.startLine.objectX,
          y: session.startLine.objectY,
          startX: session.startLine.startX,
          startY: session.startLine.startY,
          endX: session.startLine.endX,
          endY: session.startLine.endY
        }
    : { ...object, x: session.startBounds.x, y: session.startBounds.y, width: session.startBounds.width, height: session.startBounds.height };
  const command = createStudioTransformCommand(before, object);

  if (command) {
    options.applyCommand(command, { selectedObjectId: object.id, statusMessage: "Canvas edit" });
    return true;
  }

  return false;
}
