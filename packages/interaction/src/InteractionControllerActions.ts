import { endObjectDrag } from "./endObjectDrag.js";
import { endObjectResize } from "./endObjectResize.js";
import { startObjectResize } from "./startObjectResize.js";
import type { EndControllerInteractionOptions, StartControllerResizeOptions } from "./InteractionController.type.js";

export function startControllerResize(options: StartControllerResizeOptions): void {
  if (!options.object) {
    return;
  }

  options.state.resizeState = startObjectResize({
    object: options.object,
    handleName: options.handle.name,
    pointerX: options.pointerX,
    pointerY: options.pointerY,
    minWidth: options.minWidth,
    minHeight: options.minHeight
  });
  options.state.hoveredHandle = options.handle;
  options.state.mode = "resizing";
  options.updateCursor();
}

export function endControllerInteraction(options: EndControllerInteractionOptions): void {
  if (options.state.dragState) {
    endObjectDrag({ state: options.state.dragState });
  }

  if (options.state.resizeState) {
    endObjectResize({ state: options.state.resizeState });
  }

  options.state.dragState = null;
  options.state.resizeState = null;
  options.state.mode = "idle";
  options.updateCursor();
}
