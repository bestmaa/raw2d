import type { BasicMaterialStrokeCap, BasicMaterialStrokeJoin } from "raw2d-core";
import type { WebGLLocalPoint, WebGLStrokeGeometryOptions } from "./WebGLPathGeometry.type.js";

export interface WebGLStrokeSegment {
  readonly start: WebGLLocalPoint;
  readonly end: WebGLLocalPoint;
  readonly dx: number;
  readonly dy: number;
  readonly normalX: number;
  readonly normalY: number;
}

export interface WebGLResolvedStrokeStyle {
  readonly lineWidth: number;
  readonly strokeCap: BasicMaterialStrokeCap;
  readonly strokeJoin: BasicMaterialStrokeJoin;
  readonly miterLimit: number;
}

export type WebGLStrokeStyleOptions = WebGLStrokeGeometryOptions;
