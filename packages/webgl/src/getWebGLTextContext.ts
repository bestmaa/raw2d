export function getWebGLTextContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("WebGL Text2D rendering needs a 2D canvas context.");
  }

  return context;
}
