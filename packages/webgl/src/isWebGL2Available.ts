import type { IsWebGL2AvailableOptions } from "./isWebGL2Available.type.js";

export function isWebGL2Available(options: IsWebGL2AvailableOptions = {}): boolean {
  if (typeof WebGL2RenderingContext === "undefined") {
    return false;
  }

  const canvas = options.canvas ?? createProbeCanvas();

  if (!canvas) {
    return false;
  }

  try {
    return canvas.getContext("webgl2", options.contextAttributes ?? {}) !== null;
  } catch {
    return false;
  }
}

function createProbeCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  return document.createElement("canvas");
}
