import type { Matrix3 } from "raw2d-core";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLVertexWriterOptions } from "./WebGLVertex.type.js";

export interface WebGLLocalPoint {
  readonly x: number;
  readonly y: number;
}

export interface WebGLStrokeWriteOptions extends WebGLVertexWriterOptions {
  readonly matrix: Matrix3;
  readonly color: WebGLColor;
  readonly lineWidth: number;
}

export interface WebGLFillWriteOptions extends WebGLVertexWriterOptions {
  readonly matrix: Matrix3;
  readonly color: WebGLColor;
}

export interface WebGLShapeWriteOptions extends WebGLFillWriteOptions {
  readonly curveSegments: number;
  readonly strokeColor: WebGLColor;
}
