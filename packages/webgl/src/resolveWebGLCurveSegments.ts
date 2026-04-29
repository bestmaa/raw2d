import type { ResolveWebGLCurveSegmentsOptions } from "./resolveWebGLCurveSegments.type.js";

export const minimumWebGLCurveSegments = 8;
export const defaultWebGLCurveSegments = 32;

export function resolveWebGLCurveSegments(options: ResolveWebGLCurveSegmentsOptions = {}): number {
  const value = options.curveSegments ?? options.fallback ?? defaultWebGLCurveSegments;
  return Math.max(minimumWebGLCurveSegments, Math.floor(value));
}
