import type { ObjectResizeState, UpdateObjectResizeOptions } from "./ObjectResize.type.js";

export function updateObjectResize(options: UpdateObjectResizeOptions): void {
  if (!options.state.active) {
    return;
  }

  const deltaX = options.pointerX - options.state.startPointerX;
  const deltaY = options.pointerY - options.state.startPointerY;
  const horizontal = getHorizontalResize(options.state, deltaX);
  const vertical = getVerticalResize(options.state, deltaY);

  options.state.object.setPosition(horizontal.x, vertical.y);
  options.state.object.setSize(horizontal.width, vertical.height);
}

function getHorizontalResize(state: ObjectResizeState, deltaX: number): { readonly x: number; readonly width: number } {
  if (state.handleName.includes("left")) {
    const width = Math.max(state.minWidth, state.startWidth - deltaX);
    return {
      x: state.startObjectX + state.startWidth - width,
      width
    };
  }

  if (state.handleName.includes("right")) {
    return {
      x: state.startObjectX,
      width: Math.max(state.minWidth, state.startWidth + deltaX)
    };
  }

  return {
    x: state.startObjectX,
    width: state.startWidth
  };
}

function getVerticalResize(state: ObjectResizeState, deltaY: number): { readonly y: number; readonly height: number } {
  if (state.handleName.startsWith("top")) {
    const height = Math.max(state.minHeight, state.startHeight - deltaY);
    return {
      y: state.startObjectY + state.startHeight - height,
      height
    };
  }

  if (state.handleName.startsWith("bottom")) {
    return {
      y: state.startObjectY,
      height: Math.max(state.minHeight, state.startHeight + deltaY)
    };
  }

  return {
    y: state.startObjectY,
    height: state.startHeight
  };
}
