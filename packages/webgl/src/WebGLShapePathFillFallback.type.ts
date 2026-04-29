import type { WebGLShapePathFillSupportReason } from "./WebGLShapePathFillSupport.type.js";

export type WebGLShapePathFillFallbackMode = "skip" | "warn";

export interface WebGLShapePathFillFallbackReport {
  readonly objectId: string;
  readonly objectName: string;
  readonly reason: WebGLShapePathFillSupportReason;
}
