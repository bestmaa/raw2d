import type { WebGLLocalPoint } from "./WebGLPathGeometry.type.js";

export type WebGLShapePathFillSupportReason =
  | "simple"
  | "disabled"
  | "empty"
  | "open-subpath"
  | "multiple-subpaths"
  | "degenerate"
  | "self-intersection";

export interface WebGLShapePathFillSupport {
  readonly supported: boolean;
  readonly reason: WebGLShapePathFillSupportReason;
  readonly points: readonly WebGLLocalPoint[];
}

export interface WebGLShapePathFillSubpath {
  readonly points: readonly WebGLLocalPoint[];
  readonly closed: boolean;
}
