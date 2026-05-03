import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { CreateRaw2DReactRendererOptions, CreateRaw2DReactRendererResult } from "./createRaw2DReactRenderer.type.js";

export function createRaw2DReactRenderer(options: CreateRaw2DReactRendererOptions): CreateRaw2DReactRendererResult {
  const commonOptions = {
    canvas: options.canvas,
    width: options.width,
    height: options.height,
    backgroundColor: options.backgroundColor
  };

  if (options.renderer === "webgl" && isWebGL2Available({ canvas: options.canvas })) {
    return {
      renderer: new WebGLRenderer2D(commonOptions),
      rendererKind: "webgl"
    };
  }

  if (options.renderer === "webgl" && !options.fallbackToCanvas) {
    return {
      renderer: new WebGLRenderer2D(commonOptions),
      rendererKind: "webgl"
    };
  }

  return {
    renderer: new Canvas({ ...commonOptions, pixelRatio: options.pixelRatio }),
    rendererKind: "canvas"
  };
}
