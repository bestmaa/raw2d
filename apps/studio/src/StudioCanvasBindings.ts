import { createStudioTransformBatchCommand, createStudioTransformCommand, findStudioObject } from "./StudioCommandFactory";
import { getStudioCanvasWorldPoint, moveStudioObject, pickStudioObjectId, startStudioDrag } from "./StudioDrag";
import type { StudioDragSession } from "./StudioDrag.type";
import { moveStudioObjects, startStudioMultiDrag } from "./StudioMultiDrag";
import type { StudioMultiDragSession } from "./StudioMultiDrag.type";
import { resizeStudioObject, startStudioResize } from "./StudioResize";
import type { StudioResizeSession } from "./StudioResize.type";
import { updateStudioSelection } from "./StudioSelection";
import type { StudioCanvasBindingOptions } from "./StudioCanvasBindings.type";

export function bindStudioCanvasDrag(options: StudioCanvasBindingOptions): void {
  const canvasElement = options.root.querySelector<HTMLCanvasElement>(".studio-canvas");
  let dragSession: StudioDragSession | undefined;
  let multiDragSession: StudioMultiDragSession | undefined;
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
    const scene = options.getScene();

    if (event.shiftKey) {
      const selection = updateStudioSelection({
        scene,
        selectedObjectIds: options.getSelectedObjectIds(),
        objectId: pickStudioObjectId(scene, pointer),
        additive: true
      });
      options.setSelectedObjectIds(selection);
      options.setSelectedObjectId(selection.at(-1));
      options.mount();
      event.preventDefault();
      return;
    }

    const resizeStart = options.getSelectedObjectIds().length > 1
      ? undefined
      : startStudioResize(scene, options.getSelectedObjectId(), pointer);

    if (resizeStart) {
      options.setSelectedObjectId(resizeStart.selectedObjectId);
      options.setSelectedObjectIds([resizeStart.selectedObjectId]);
      resizeSession = resizeStart.session;
      canvasElement.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    const multiDragStart = startStudioMultiDrag(scene, options.getSelectedObjectIds(), pointer);

    if (multiDragStart) {
      options.setSelectedObjectIds(multiDragStart.selectedObjectIds);
      options.setSelectedObjectId(multiDragStart.selectedObjectIds.at(-1));
      multiDragSession = multiDragStart.session;
      canvasElement.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    const dragStart = startStudioDrag(scene, options.getSelectedObjectId(), pointer);

    if (!dragStart) {
      return;
    }

    options.setSelectedObjectId(dragStart.selectedObjectId);
    options.setSelectedObjectIds([dragStart.selectedObjectId]);
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

    if (multiDragSession) {
      options.setScene(moveStudioObjects({ scene: options.getScene(), session: multiDragSession, pointer }));
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
    const session = dragSession ?? resizeSession ?? multiDragSession;

    if (!session) {
      return;
    }

    const didRecordCommand = recordCanvasTransform(options, session);
    dragSession = undefined;
    multiDragSession = undefined;
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

function recordCanvasTransform(
  options: StudioCanvasBindingOptions,
  session: StudioDragSession | StudioResizeSession | StudioMultiDragSession
): boolean {
  if ("startObjects" in session) {
    const command = createStudioTransformBatchCommand(session.startObjects, options.getScene());

    if (command) {
      options.applyCommand(command, {
        selectedObjectId: session.objectIds.at(-1),
        selectedObjectIds: session.objectIds,
        statusMessage: "Canvas edit"
      });
      return true;
    }

    return false;
  }

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
      : session.startText
        ? { ...object, x: session.startText.x, y: session.startText.y, font: session.startText.font }
    : { ...object, x: session.startBounds.x, y: session.startBounds.y, width: session.startBounds.width, height: session.startBounds.height };
  const command = createStudioTransformCommand(before, object);

  if (command) {
    options.applyCommand(command, { selectedObjectId: object.id, selectedObjectIds: [object.id], statusMessage: "Canvas edit" });
    return true;
  }

  return false;
}
