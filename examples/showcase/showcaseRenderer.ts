import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { ShowcaseRendererOptions, ShowcaseRendererResult } from "./ShowcaseRenderer.type";

const backgroundColor = "#10141c";

export function createShowcaseRenderer(options: ShowcaseRendererOptions): ShowcaseRendererResult {
  if (options.mode === "webgl" && isWebGL2Available({ canvas: options.canvas })) {
    return {
      activeMode: "webgl",
      label: "WebGL2",
      renderer: new WebGLRenderer2D({
        canvas: options.canvas,
        width: options.width,
        height: options.height,
        backgroundColor
      })
    };
  }

  return {
    activeMode: "canvas",
    label: options.mode === "webgl" ? "Canvas fallback" : "Canvas",
    renderer: new Canvas({
      canvas: options.canvas,
      width: options.width,
      height: options.height,
      backgroundColor
    })
  };
}
