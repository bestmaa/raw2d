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
    return resizeAxis({
      fixedPosition: state.startObjectX + state.startWidth,
      movingPosition: state.startObjectX + deltaX,
      minSize: state.minWidth
    });
  }

  if (state.handleName.includes("right")) {
    return resizeAxis({
      fixedPosition: state.startObjectX,
      movingPosition: state.startObjectX + state.startWidth + deltaX,
      minSize: state.minWidth
    });
  }

  return {
    x: state.startObjectX,
    width: state.startWidth
  };
}

function getVerticalResize(state: ObjectResizeState, deltaY: number): { readonly y: number; readonly height: number } {
  if (state.handleName.startsWith("top")) {
    const resize = resizeAxis({
      fixedPosition: state.startObjectY + state.startHeight,
      movingPosition: state.startObjectY + deltaY,
      minSize: state.minHeight
    });

    return { y: resize.x, height: resize.width };
  }

  if (state.handleName.startsWith("bottom")) {
    const resize = resizeAxis({
      fixedPosition: state.startObjectY,
      movingPosition: state.startObjectY + state.startHeight + deltaY,
      minSize: state.minHeight
    });

    return { y: resize.x, height: resize.width };
  }

  return {
    y: state.startObjectY,
    height: state.startHeight
  };
}

function resizeAxis(options: {
  readonly fixedPosition: number;
  readonly movingPosition: number;
  readonly minSize: number;
}): { readonly x: number; readonly width: number } {
  const size = Math.max(options.minSize, Math.abs(options.movingPosition - options.fixedPosition));
  const crossed = options.movingPosition < options.fixedPosition;
  const x = crossed ? options.fixedPosition - size : options.fixedPosition;

  return { x, width: size };
}
